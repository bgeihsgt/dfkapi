import request from 'supertest';
import app from './app';
import { deleteAllHeroes, upsertHero, closeConnections } from '@dfkapi/data-postgres';
import { makeHero } from "@dfkapi/data-core/src/testdata";

describe("API", () => {

    beforeEach(async () => {
        await deleteAllHeroes();
    });

    afterAll(async () => {
        await closeConnections();
    })


    describe("GraphQL endpoint" , () => {
    
        describe("hero query", () => {
            it("should return all requested hero attributes when given valid ID", async () => {
                const hero = makeHero();
                await upsertHero(hero, { currentChainId: 0, summonedChainId: 0 });
    
                await request(app)
                  .post('/graphql')
                  .set('Accept', 'application/json')
                  .send({ query: getHeroQuery(hero.id.toString()), variables: null })
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
    
             it("should return a null hero if the hero does not exist", async () => {
                await request(app)
                  .post('/graphql')
                  .set('Accept', 'application/json')
                  .send({ query: getHeroQuery("5555555555"), variables: null })
                  .expect(200, {
                      data: {
                        hero: null
                      },
                      errors: [ { message: 'Hero with ID "5555555555" does not exist' }]
                  });
             });
    
             it("should return a null hero if the id is not a bigint string", async () => {
                await request(app)
                  .post('/graphql')
                  .set('Accept', 'application/json')
                  .send({ query: getHeroQuery("abcdefghijk"), variables: null })
                  .expect(200, {
                      data: {
                        hero: null
                      },
                      errors: [ { message: '"abcdefghijk" is not a valid hero ID' }]
                  });
             })
        });
        
    });
    
    describe("REST endpoint", () => {
    
        describe("hero resource", () => {
    
            it("should return a hero for an existing hero ID", async () => {
                const hero = makeHero();
                await upsertHero(hero, { currentChainId: 0, summonedChainId: 0 });

                await request(app)
                  .get('/api/heroes/16639')
                  .set('Accept', 'application/vnd.api+json')
                  .send()
                  .expect(200, {
                      jsonapi: {
                          version: "1.0"
                      },
                      data: {
                        type: "heroes",
                        id: "16639",
                        attributes: {
                            rarity: 1,
                            rarityString: "Uncommon"
                        }
                      }
                  });
            });
    
        });
    
    });

});


function getHeroQuery(id: string) { return `{
    hero(id: "${id}") { 
        id
        rarity
        rarityString
    }
}`;
}