export function unixTimeToTimestamp(unixTime: bigint): string {
    const numberfied = Number(unixTime * 1000n) 
    return new Date(numberfied).toISOString();
}

export function timestampToUnixTime(timestamp: string): bigint {
    const unixTime = new Date(timestamp).getTime() / 1000;
    return BigInt(unixTime);
}