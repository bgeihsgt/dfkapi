import knex from './knex';

import { makeHero, makeHeroSummonedEvent } from "@dfkapi/data-core/src/testdata";
import { upsertHero, getHero, upsertHeroSummonedEvent, upsertHeroSummonedEvents } from './heroes';

describe('Heroes Postgres API', () => {

    beforeAll(async () => {
        await knex('heroes').truncate();
        await knex('hero_summoned_events').truncate();
    });

    afterAll(async () => {
        await knex.destroy();
    });

    describe("upsertHero", () => {
        it("should create a hero if it does not exist", async () => {
            const hero = makeHero({ id: 16639n });

            await upsertHero(hero);

            const actual = await getHero(hero.id);

            expect(actual).toEqual(hero);
        });

        it("should update the hero if it already exists", async () => {
            const hero = makeHero({ id: 20000n });

            await upsertHero(hero);

            const updatedHero = {
                ...hero,
                xp: hero.xp + 1n
            };

            await upsertHero(updatedHero);

            const actual = await getHero(hero.id);

            expect(actual).toEqual(updatedHero);
        })
    });

    describe("upsertHeroSummonedEvent", () => {
        beforeEach(async () => {
            await knex('hero_summoned_events').truncate();
        });

        it("should create an event if it does not exist", async () => {
            const heroSummonedEvent = makeHeroSummonedEvent();

            await upsertHeroSummonedEvent(heroSummonedEvent, 0);

            const events = await knex("hero_summoned_events").select();

            expect(events).toHaveLength(1);

            expect(events[0].updated_at).not.toBeNull();
            expect(events[0].created_at).not.toBeNull();
            expect(events[0]).toEqual(expect.objectContaining({
                address: "0xEb9B61B145D6489Be575D3603F4a704810e143dF",
                assistant_id: "138763",
                block_number: 2704539,
                chain_id: 0,
                hero_id: "1000000000963",
                log_index: 0,
                owner: "0x99c71df5B17538b0CF10F6FdDaD18766349A7606",
                removed: false,
                stat_genes: "335060172297479571679811471009455345990633112149212708157934403571615938",
                summoner_id: "125404",
                transaction_hash: "0xb4ebf760fb4fb93fa6580fe3723f3ebae8002908b1d13cba890e79fafa0241d6",
                transaction_index: 1,
                visual_genes: "170985199761119229137574546544909115454800841947938051489981624386329604",
            }));
        });

        it("should update an event on primary key match", async () => {
            const heroSummonedEvent = makeHeroSummonedEvent();

            await upsertHeroSummonedEvent(heroSummonedEvent, 0);

            const updatedHeroSummonedEvent = {
                ...heroSummonedEvent,
                data: {
                    ...heroSummonedEvent.data,
                    heroId: 1234n
                }
            };

            await upsertHeroSummonedEvent(updatedHeroSummonedEvent, 0);

            const events = await knex("hero_summoned_events").select();

            expect(events).toHaveLength(1);

            expect(events[0].hero_id).toEqual("1234");
        });
    });

    describe("upsertHeroSummonedEvents", () => {
        beforeEach(async () => {
            await knex('hero_summoned_events').truncate();
        });

        it("should upsert many events", async () => {
            const heroSummonedEvents = [
                makeHeroSummonedEvent({ logIndex: 1 }),
                makeHeroSummonedEvent({ logIndex: 2 }),
                makeHeroSummonedEvent({ logIndex: 3 })
            ];

            await upsertHeroSummonedEvents(heroSummonedEvents, 0);

            const events = await knex("hero_summoned_events").select();
            
            expect(events).toHaveLength(3);
        });
    });
});