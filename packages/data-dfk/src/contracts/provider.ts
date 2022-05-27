import { ethers } from "ethers";

export const HARMONY_API_URL = "https://api.harmony.one/";

export function getSerendaleProvider() {
    const url = HARMONY_API_URL;
    const provider = new ethers.providers.JsonRpcProvider(url);

    return provider;
}