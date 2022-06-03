import { Contract, EventFilter, Event } from 'ethers';
import pMap from 'p-map';
import { Provider } from './provider';
import { retry } from '@dfkapi/data-core';

interface BlockRange {
    from: number,
    to: number
}

export interface EventWithTimestamp {
    event: Event,
    timestamp: number
}

export function splitBlockRanges(fromBlock: number, toBlock: number, chunkSize: number): Array<BlockRange> {
    let result = [];
    let currentFrom = fromBlock;

    while (currentFrom <= toBlock) {
        const currentTo = Math.min(currentFrom + chunkSize - 1, toBlock);
        result.push({ from: currentFrom, to: currentTo });
        currentFrom = currentTo + 1;
    }

    return result;
}

async function getBlockTimestampsFromEvents(events: Event[], getProvider: () => Provider) {
    const uniqueBlockNumbers = [...new Set(events.map(e => e.blockNumber))];
    const mapper = async (blockNumber: number): Promise<[number, number]> => {
        return await retry(async () => {
            const provider = getProvider();

            return [blockNumber, (await provider.provider.getBlock(blockNumber)).timestamp];
        });
    };
    
    return new Map(await pMap(uniqueBlockNumbers, mapper, { concurrency: 30 }));
}

export async function getEventsParallelized(getProvider: () => Provider, getContract: () => Contract, getFilter: (c: Contract) => EventFilter, fromBlock: number, toBlock: number): Promise<EventWithTimestamp[]> {
    const mapper = async (blockRange: BlockRange): Promise<EventWithTimestamp[]> => {
        return await retry(async () => {
            const contract = getContract();
            const events = await contract.queryFilter(getFilter(contract), blockRange.from, blockRange.to);
            const blockTimestampMap = await getBlockTimestampsFromEvents(events, getProvider);
            return events.map(e => ({ event: e, timestamp: blockTimestampMap.get(e.blockNumber) || 0 }));
        });
    };

    const CHUNK_SIZE = 1000;
    const blockRanges = splitBlockRanges(fromBlock, toBlock, CHUNK_SIZE);
    return (await pMap(blockRanges, mapper, { concurrency: 10 })).flat();
}