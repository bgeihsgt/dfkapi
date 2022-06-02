import knex from './knex';

import { upsertIndexState, getIndexState } from './indexState';

describe("IndexState Postgres operations", () => {

    beforeEach(async () => {
        await knex("index_state").truncate();
    });

    afterAll(async () => {
        await knex.destroy();
    });

    describe("upsertIndexState", () => {

        it("should create a new state record when it does not exist", async () => {
            const inserted = {
                chainId: 0,
                name: "HeroSummoned",
                blockNumber: 12345
            };

            await upsertIndexState(inserted);

            const retrieved = await getIndexState(inserted.chainId, inserted.name);

            expect(retrieved.get()).toEqual(inserted);
        });

        it("should update the matching state record if it already exists", async () => {
            const original = {
                chainId: 1,
                name: "HeroSummoned",
                blockNumber: 55555
            };

            await upsertIndexState(original);

            const updated = {
                ...original,
                blockNumber: 77777
            };

            await upsertIndexState(updated);

            const retrieved = await getIndexState(updated.chainId, updated.name);

            expect(retrieved.get()).toEqual(updated);
        });
    });

    describe("getIndexState", () => {
        it("should return empty Optional when requested state does not exist", async () => {
            const retrieved = await getIndexState(0, "DoesNotExist");

            expect(retrieved.isEmpty()).toBe(true);
        });
    });

});