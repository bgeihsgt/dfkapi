import request from 'supertest';
import app from './app';
import { deleteAllHeroes, upsertHero, closeConnections } from '@dfkapi/data-postgres';
import { makeHero } from "@dfkapi/data-core/src/testdata";

describe("GraphQL endpoint" , () => {

    beforeEach(async () => {
        await deleteAllHeroes();
    });

    afterAll(async () => {
        await closeConnections();
    })

    describe("hero query", () => {
        it("should return all requested hero attributes when given valid ID", async () => {
            await upsertHero(makeHero(), { currentChainId: 0, summonedChainId: 0 });

            await request(app)
              .post('/graphql')
              .set('Accept', 'application/json')
              .send({ query: getHeroQuery(), variables: null })
              .expect(200, {
                  data: {
                    hero: { 
                        id: "16639",
                        rarity: 1,
                        rarityString: "Uncommon"
                    }
                  }
              });
         });
    });
    
});

function getHeroQuery() { return `{
    hero(id: "16639") { 
        id
        rarity
        rarityString
    }
}`;
}