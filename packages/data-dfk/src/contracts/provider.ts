import { ethers } from "ethers";

export const HARMONY_API_URL = "https://api.harmony.one/";
export const DFK_CHAIN_API_HOST = "https://subnets.avax.network";
export const DFK_CHAIN_API_URL = `${DFK_CHAIN_API_HOST}/defi-kingdoms/dfk-chain/rpc`;

export enum ProviderLocation {
    Serendale = "serendale",
    Crystalvale = "crystalvale"
}

export interface Provider {
    provider: ethers.providers.Provider,
    location: ProviderLocation
}

function getProvider(url: string, location: ProviderLocation): Provider {
    return {
        provider: new ethers.providers.JsonRpcProvider(url),
        location
    }
}
export function getSerendaleProvider(): Provider {
    return getProvider(HARMONY_API_URL, ProviderLocation.Serendale);
}

export function getCrystalvaleProvider(): Provider {
    return getProvider(DFK_CHAIN_API_URL, ProviderLocation.Crystalvale);
}