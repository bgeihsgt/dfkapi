import { Optional } from "typescript-optional";

export function parseBigInt(value: string): Optional<bigint> {
    try {
        return Optional.of(BigInt(value));
    } catch (e) {
        return Optional.empty();
    }
}