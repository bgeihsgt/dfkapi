export function unixTimeToTimestamp(unixTime: bigint | number): string {
    const numberfied = (typeof(unixTime) === "number") ? (unixTime * 1000) : Number(unixTime * 1000n);
    return new Date(numberfied).toISOString();
}

export function timestampToUnixTime(timestamp: string): bigint {
    const unixTime = new Date(timestamp).getTime() / 1000;
    return BigInt(unixTime);
}