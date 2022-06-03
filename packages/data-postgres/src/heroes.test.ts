import knex from './knex';

import { makeHero, makeHeroSummonedEvent } from "@dfkapi/data-core/src/testdata";
import { upsertHero, getHero, upsertHeroSummonedEvent, upsertHeroSummonedEvents, paginateAllSummonedHeroIds, getSummonedHeroIdsWithNoHeroRecord } from './heroes';

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

            await upsertHero(hero, { currentChainId: 0, summonedChainId: 1 });

            const actual = await getHero(hero.id);

            expect(actual.get()).toEqual({
                ...hero,
                chainInfo: {
                    currentChainId: 0,
                    summonedChainId: 1
                }
            });
        });

        it("should update the hero if it already exists", async () => {
            const hero = makeHero({ id: 20000n });

            await upsertHero(hero, { currentChainId: 0, summonedChainId: 0 });

            const updatedHero = {
                ...hero,
                xp: hero.xp + 1n
            };

            await upsertHero(updatedHero, { currentChainId: 0, summonedChainId: 0 });

            const actual = await getHero(hero.id);

            expect(actual.get()).toEqual({
                ...updatedHero,
                chainInfo: {
                    currentChainId: 0,
                    summonedChainId: 0
                }
            });
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
                timestamp: new Date("2022-04-07T23:10:44.000Z")
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

    describe("getHero", () => {
        it("should return empty Optional if the hero id does not exist", async () => {
            const retrieved = await getHero(90909090n);

            expect(retrieved.isEmpty()).toBe(true);
        });
    });

    describe("paginateAllSummonedHeroIds", () => {
        beforeEach(async () => {
            await knex('hero_summoned_events').truncate();
        });

        it("should retrieve all hero ids in order in chunks from the given chainId", async () => {
            const heroSummonedEvents = [
                makeHeroSummonedEvent({ logIndex: 1, heroId: 1000n }),
                makeHeroSummonedEvent({ logIndex: 2, heroId: 997n }),
                makeHeroSummonedEvent({ logIndex: 3, heroId: 34n }),
                makeHeroSummonedEvent({ logIndex: 4, heroId: 1001n }),
                makeHeroSummonedEvent({ logIndex: 21, heroId: 1002n }),
                makeHeroSummonedEvent({ logIndex: 32, heroId: 3n }),
                makeHeroSummonedEvent({ logIndex: 49, heroId: 4n }),
                makeHeroSummonedEvent({ logIndex: 94, heroId: 2n }),
                makeHeroSummonedEvent({ logIndex: 99, heroId: 1n }),
                makeHeroSummonedEvent({ logIndex: 101, heroId: 10000n }),
            ];

            const otherChainEvents = [
                makeHeroSummonedEvent({ logIndex: 10, heroId: 100_000_000n }),
            ];

            await upsertHeroSummonedEvents(heroSummonedEvents, 0);
            await upsertHeroSummonedEvents(otherChainEvents, 1);

            let collectedIds: bigint[] = [];
            let timesCalled = 0;
            await paginateAllSummonedHeroIds(0, async ids => {
                collectedIds = collectedIds.concat(ids);
                timesCalled++;
            }, 3);

            expect(collectedIds).toEqual([
                1n,
                2n,
                3n,
                4n,
                34n,
                997n,
                1000n,
                1001n,
                1002n,
                10000n
            ]);
            expect(timesCalled).toBe(4);

        });
    });

    describe("getSummonedHeroIdsWithNoHeroRecord", () => {
        beforeEach(async () => {
            await knex('hero_summoned_events').truncate();
        });

        it("should retrieve all hero ids in order with limit from the given chainId", async () => {
            const heroSummonedEvents = [
                makeHeroSummonedEvent({ logIndex: 1, heroId: 1000n }),
                makeHeroSummonedEvent({ logIndex: 2, heroId: 997n }),
                makeHeroSummonedEvent({ logIndex: 3, heroId: 34n }),
                makeHeroSummonedEvent({ logIndex: 4, heroId: 1001n }),
                makeHeroSummonedEvent({ logIndex: 21, heroId: 1002n }),
                makeHeroSummonedEvent({ logIndex: 32, heroId: 3n }),
                makeHeroSummonedEvent({ logIndex: 49, heroId: 4n }),
                makeHeroSummonedEvent({ logIndex: 94, heroId: 2n }),
                makeHeroSummonedEvent({ logIndex: 99, heroId: 1n }),
                makeHeroSummonedEvent({ logIndex: 101, heroId: 10000n }),
            ];

            const otherChainEvents = [
                makeHeroSummonedEvent({ logIndex: 10, heroId: 0n }),
            ];

            await upsertHeroSummonedEvents(heroSummonedEvents, 0);
            await upsertHeroSummonedEvents(otherChainEvents, 1);

            const ids = await getSummonedHeroIdsWithNoHeroRecord(0, 0n, 3);

            expect(ids).toEqual([
                1n,
                2n,
                3n,
            ]);

        });

        it("should not return ids that already exist in the heroes table", async () => {
            const heroSummonedEvents = [
                makeHeroSummonedEvent({ logIndex: 1, heroId: 1000n }),
                makeHeroSummonedEvent({ logIndex: 2, heroId: 997n }),
            ];

            const existingHero = makeHero({ id: heroSummonedEvents[1].data.heroId });

            await upsertHero(existingHero, { currentChainId: 0, summonedChainId: 0 });
            await upsertHeroSummonedEvents(heroSummonedEvents, 0);

            const ids = await getSummonedHeroIdsWithNoHeroRecord(0, 0n, 3);

            expect(ids).toEqual([
                1000n
            ]);
        });

        it("filters >= the startingId", async () => {
            const heroSummonedEvents = [
                makeHeroSummonedEvent({ logIndex: 1, heroId: 1000n }),
                makeHeroSummonedEvent({ logIndex: 2, heroId: 997n }),
                makeHeroSummonedEvent({ logIndex: 3, heroId: 34n }),
                makeHeroSummonedEvent({ logIndex: 4, heroId: 1001n }),
                makeHeroSummonedEvent({ logIndex: 21, heroId: 1002n }),
                makeHeroSummonedEvent({ logIndex: 32, heroId: 3n }),
                makeHeroSummonedEvent({ logIndex: 49, heroId: 4n }),
                makeHeroSummonedEvent({ logIndex: 94, heroId: 2n }),
                makeHeroSummonedEvent({ logIndex: 99, heroId: 1n }),
                makeHeroSummonedEvent({ logIndex: 101, heroId: 10000n }),
            ];

            await upsertHeroSummonedEvents(heroSummonedEvents, 0);

            const ids = await getSummonedHeroIdsWithNoHeroRecord(0, 1001n, 3);

            expect(ids).toEqual([
                1001n,
                1002n,
                10000n
            ]);
        });
    });
});