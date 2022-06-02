import { getHeroSummonedEvents } from "./heroes";
import { getSerendaleProvider } from "./contracts/provider";
import { splitBlockRanges } from "./contracts/events";

const api = {
    getHeroSummonedEvents,
    getSerendaleProvider,
    splitBlockRanges
}

export default api;

