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
            it("should return all requested simple non-changing hero attributes when given valid ID", async () => {
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
                            rarityString: "Uncommon",
                            summonedTime: 1636277273,
                            maxSummons: 8,
                            statGenes: "169104949124006740833713545013310629570420355242807884221727877095229900",
                            visualGenes: "167423273338057992327143396655521143799658635409147523893565316370864131",
                            shiny: false,
                            generation: 2,
                            firstName: 1730,
                            lastName: 1898,
                            shinyStyle: 13,
                            mainClass: "Pirate",
                            mainClassNumber: 7,
                            subClass: "Priest",
                            subClassNumber: 4,
                            strengthGrowthP: 7000,
                            intelligenceGrowthP: 2000,
                            wisdomGrowthP: 2000,
                            luckGrowthP: 5500,
                            agilityGrowthP: 5000,
                            vitalityGrowthP: 6000,
                            enduranceGrowthP: 5500,
                            dexterityGrowthP: 7200,
                            hpSmGrowth: 1500,
                            hpRgGrowth: 4500,
                            hpLgGrowth: 4000,
                            mpSmGrowth: 4500,
                            mpRgGrowth: 4000,
                            mpLgGrowth: 1500,
                            strengthGrowthS: 750,
                            intelligenceGrowthS: 1750,
                            wisdomGrowthS: 2000,
                            luckGrowthS: 1000,
                            agilityGrowthS: 1000,
                            vitalityGrowthS: 1250,
                            enduranceGrowthS: 1500,
                            dexterityGrowthS: 1150,
                            hpSmGrowthS: 875,
                            hpRgGrowthS: 1000,
                            hpLgGrowthS: 625,
                            mpSmGrowthS: 375,
                            mpRgGrowthS: 875,
                            mpLgGrowthS: 1250
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
    
            it("should return a hero and correct attributes for an existing hero ID", async () => {
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
                            rarityString: "Uncommon",
                            summonedTime: 1636277273,
                            maxSummons: 8,
                            statGenes: '169104949124006740833713545013310629570420355242807884221727877095229900',
                            visualGenes: '167423273338057992327143396655521143799658635409147523893565316370864131',
                            shiny: false,
                            shinyStyle: 13,
                            generation: 2,
                            firstName: 1730,
                            lastName: 1898,
                            mainClass: 'Pirate',
                            mainClassNumber: 7,
                            subClass: 'Priest',
                            subClassNumber: 4,
                            strengthGrowthP: 7000,
                            intelligenceGrowthP: 2000,
                            wisdomGrowthP: 2000,
                            luckGrowthP: 5500,
                            agilityGrowthP: 5000,
                            vitalityGrowthP: 6000,
                            enduranceGrowthP: 5500,
                            dexterityGrowthP: 7200,
                            hpSmGrowth: 1500,
                            hpRgGrowth: 4500,
                            hpLgGrowth: 4000,
                            mpSmGrowth: 4500,
                            mpRgGrowth: 4000,
                            mpLgGrowth: 1500,
                            strengthGrowthS: 750,
                            intelligenceGrowthS: 1750,
                            wisdomGrowthS: 2000,
                            luckGrowthS: 1000,
                            agilityGrowthS: 1000,
                            vitalityGrowthS: 1250,
                            enduranceGrowthS: 1500,
                            dexterityGrowthS: 1150,
                            hpSmGrowthS: 875,
                            hpRgGrowthS: 1000,
                            hpLgGrowthS: 625,
                            mpSmGrowthS: 375,
                            mpRgGrowthS: 875,
                            mpLgGrowthS: 1250
                        }
                      }
                  });
            });

            it("should return 404 for hero ID not found", async () => {
                await request(app)
                  .get('/api/heroes/555555555')
                  .set('Accept', 'application/vnd.api+json')
                  .send()
                  .expect(404, {
                      errors: [{
                          title: "NotFoundError",
                          detail: 'Hero with ID "555555555" does not exist'
                      }]
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
        summonedTime
        maxSummons
        statGenes
        visualGenes
        shiny
        generation
        firstName
        lastName
        shinyStyle
        mainClass
        mainClassNumber
        subClass
        subClassNumber
        strengthGrowthP
        intelligenceGrowthP
        wisdomGrowthP
        luckGrowthP
        agilityGrowthP
        vitalityGrowthP
        enduranceGrowthP
        dexterityGrowthP
        hpSmGrowth
        hpRgGrowth
        hpLgGrowth
        mpSmGrowth
        mpRgGrowth
        mpLgGrowth
        strengthGrowthS
        intelligenceGrowthS
        wisdomGrowthS
        luckGrowthS
        agilityGrowthS
        vitalityGrowthS
        enduranceGrowthS
        dexterityGrowthS
        hpSmGrowthS
        hpRgGrowthS
        hpLgGrowthS
        mpSmGrowthS
        mpRgGrowthS
        mpLgGrowthS
    }
}`;
}