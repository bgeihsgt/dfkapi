import { Contract, EventFilter, Event } from 'ethers';
import pMap from 'p-map';

interface BlockRange {
    from: number,
    to: number
}

export interface BlockchainEvent<T> {
    blockNumber: number,
    blockHash: string,
    transactionIndex: number,
    removed: boolean,
    address: string,
    rawData: string,
    transactionHash: string,
    logIndex: number,
    data: T
}

export function splitBlockRanges(fromBlock: number, toBlock: number): Array<BlockRange> {
    const CHUNK_SIZE = 1000;
    let result = [];
    let currentFrom = fromBlock;

    while (currentFrom <= toBlock) {
        const currentTo = Math.min(currentFrom + CHUNK_SIZE - 1, toBlock);
        result.push({ from: currentFrom, to: currentTo });
        currentFrom = currentTo + 1;
    }

    return result;
}

export async function getEventsParallelized(getContract: () => Contract, getFilter: (c: Contract) => EventFilter, fromBlock: number, toBlock: number): Promise<Event[]> {
    const mapper = async (blockRange: BlockRange): Promise<Event[]> => {
        const contract = getContract();

        return await contract.queryFilter(getFilter(contract), blockRange.from, blockRange.to);
    };

    
    const blockRanges = splitBlockRanges(fromBlock, toBlock);
    return (await pMap(blockRanges, mapper, { concurrency: 10 })).flat();
}