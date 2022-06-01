import { Contract, EventFilter, Event } from 'ethers';
import pMap from 'p-map';

interface BlockRange {
    from: number,
    to: number
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

export async function getEventsParallelized(getContract: () => Contract, getFilter: (c: Contract) => EventFilter, fromBlock: number, toBlock: number): Promise<Event[]> {
    const mapper = async (blockRange: BlockRange): Promise<Event[]> => {
        const contract = getContract();

        return await contract.queryFilter(getFilter(contract), blockRange.from, blockRange.to);
    };

    const CHUNK_SIZE = 1000;
    const blockRanges = splitBlockRanges(fromBlock, toBlock, CHUNK_SIZE);
    return (await pMap(blockRanges, mapper, { concurrency: 10 })).flat();
}