import dataDfk from '@dfkapi/data-dfk';
import dataPostgres from '@dfkapi/data-postgres';
import pino from 'pino';

const logger = pino();

export async function importNewEvents() {
    const SERENDALE_CHAIN_ID = 0;
    const provider = dataDfk.getSerendaleProvider();
    const indexState = await dataPostgres.getIndexState(SERENDALE_CHAIN_ID, "HeroSummoned");
    const startingBlock = indexState.isPresent() ? indexState.get().blockNumber : 0;
    const latestBlock = await provider.provider.getBlockNumber();
    const blockRanges = dataDfk.splitBlockRanges(startingBlock, latestBlock, 100_000);

    for (const blockRange of blockRanges) {
        logger.info(`Retrieving hero summoned events for blocks ${blockRange.from} to ${blockRange.to}`);
        const heroSummonedEvents = await dataDfk.getHeroSummonedEvents(blockRange.from, blockRange.to, dataDfk.getSerendaleProvider);
        logger.info(`Upserting ${heroSummonedEvents.length} for blocks ${blockRange.from} to ${blockRange.to}`);
        await dataPostgres.upsertHeroSummonedEvents(heroSummonedEvents, SERENDALE_CHAIN_ID);
        await dataPostgres.upsertIndexState({
            chainId: SERENDALE_CHAIN_ID,
            name: "HeroSummoned",
            blockNumber: blockRange.to
        });
    }
}