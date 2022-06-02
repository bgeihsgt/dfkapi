import { upsertHeroSummonedEvents } from "./heroes";
import { getIndexState, upsertIndexState } from "./indexState";

const api = {
    upsertHeroSummonedEvents,
    getIndexState,
    upsertIndexState
};

export default api;