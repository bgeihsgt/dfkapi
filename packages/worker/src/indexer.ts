import { BlockchainEvent } from '@dfkapi/data-core';
import { 
    getCrystalvaleProvider,
    getSerendaleProvider, 
    getHeroSummonedEvents, 
    splitBlockRanges, 
    getHeroes,
    Provider 
} from '@dfkapi/data-dfk';
import { getIndexState, upsertIndexState, upsertHeroSummonedEvents, getSummonedHeroIdsWithNoHeroRecord, upsertHero } from '@dfkapi/data-postgres';
import pino from 'pino';

const logger = pino();

interface ImportEventsOptions<T> {
    chainId: number,
    getProvider: () => Provider,
    name: string,
    blockChunkSize: number,
    getEvents: (from: number, to: number, getProvider: () => Provider) => Promise<BlockchainEvent<T>[]>,
    upsertEvents: (events: BlockchainEvent<T>[], chainId: number) => Promise<void>
}

async function importEvents<T>(options: ImportEventsOptions<T>) {
    const provider = options.getProvider();
    const indexState = await getIndexState(options.chainId, options.name);
    const startingBlock = indexState.isPresent() ? indexState.get().blockNumber : 0;
    const latestBlock = await provider.provider.getBlockNumber();
    const blockRanges = splitBlockRanges(startingBlock, latestBlock, options.blockChunkSize);

    for (const blockRange of blockRanges) {
        logger.info(`Retrieving ${options.name} events for blocks ${blockRange.from} to ${blockRange.to} on chain id: ${options.chainId}`);
        const events = await options.getEvents(blockRange.from, blockRange.to, options.getProvider);
        logger.info(`Upserting ${events.length} ${options.name} event records for blocks ${blockRange.from} to ${blockRange.to} on chain id: ${options.chainId}`);
        await options.upsertEvents(events, options.chainId);
        await upsertIndexState({
            chainId: options.chainId,
            name: options.name,
            blockNumber: blockRange.to
        });
    }
}

export async function importNewEvents() {
    const importPromises = [importSerendaleEvents(), importCrystalvaleEvents()];
    await Promise.all(importPromises);
}

async function importSerendaleEvents() {
    const chainId = 0;
    const getProvider = getSerendaleProvider

    const configs = [
        { 
            chainId,
            getProvider,
            name: "HeroSummoned",
            blockChunkSize: 5000,
            getEvents: getHeroSummonedEvents,
            upsertEvents: upsertHeroSummonedEvents
        }
    ];

    for (const config of configs) {
        await importEvents(config);
    }
}

async function importCrystalvaleEvents() {
    const chainId = 1;
    const getProvider = getCrystalvaleProvider

    const configs = [
        {
            chainId,
            getProvider,
            name: "HeroSummoned",
            blockChunkSize: 5000,
            getEvents: getHeroSummonedEvents,
            upsertEvents: upsertHeroSummonedEvents
        }
    ];

    for (const config of configs) {
        await importEvents(config);
    }
}

export async function importNewlySummonedHeroes() {
    const refreshPromises = [importSummonedSerendaleHeroes(), importSummonedCrystalvaleHeroes()];
    await Promise.all(refreshPromises);
}

async function importSummonedHeroesWithNoHeroRecord(chainId: number, getProvider: () => Provider) {
    let ids = await getSummonedHeroIdsWithNoHeroRecord(chainId, 0n);

    while (ids.length > 0) {
        logger.info(`Creating heroes from ${ids[0]} to ${ids[ids.length - 1]}`);
        const heroes = await getHeroes(ids, getProvider);
        const upsertPromises = heroes.filter(h => h.isPresent()).map(h => upsertHero(h.get(), { currentChainId: chainId, summonedChainId: chainId }));
        await Promise.all(upsertPromises);

        if (heroes.length !== upsertPromises.length) {
            logger.warn(`GOT HERO ID SUMMONED IN ${chainId} BUT NOT RETRIEVED IN ${chainId}`);
        }

        ids = await getSummonedHeroIdsWithNoHeroRecord(chainId, ids[ids.length - 1]);
    }
}

async function importSummonedSerendaleHeroes() {
    return await importSummonedHeroesWithNoHeroRecord(0, getSerendaleProvider);
}


async function importSummonedCrystalvaleHeroes() {
    return await importSummonedHeroesWithNoHeroRecord(1, getCrystalvaleProvider);
}
