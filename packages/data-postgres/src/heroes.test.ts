import knex from './knex';

import { makeHero } from "@dfkapi/data-core/src/testdata";
import { upsertHero, getHero } from './heroes';

describe('Heroes Postgres API', () => {

    beforeAll(async () => {
        await knex('heroes').truncate();
    });

    afterAll(async () => {
        await knex.destroy();
    });

    describe("upsertHero", () => {
        it("should create a hero if it does not exist", async () => {
            const hero = makeHero();

            await upsertHero(hero);

            const actual = await getHero(hero.id);

            expect(actual).toEqual(hero);
        });

        it("should update the hero if it already exists", async () => {
            const hero = makeHero();
            const updatedHero = {
                ...hero,
                xp: hero.xp + 1n
            };

            await upsertHero(updatedHero);

            const actual = await getHero(hero.id);

            expect(actual).toEqual(updatedHero);
        })
    });
});