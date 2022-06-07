import knex from './knex';
export { upsertHeroSummonedEvents, paginateAllSummonedHeroIds, getSummonedHeroIdsWithNoHeroRecord, upsertHero, getHero, deleteAllHeroes } from "./heroes";
export { getIndexState, upsertIndexState } from "./indexState";

export async function closeConnections() {
    await knex.destroy();
}