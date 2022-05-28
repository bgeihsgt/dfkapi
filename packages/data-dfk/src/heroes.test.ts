import TalkbackServer from 'talkback/server';
import { getHero, getHeroes } from "./heroes";
import { makeHero } from "@dfkapi/data-core/src/testdata";
import { startSerendaleMockServer, getSerendaleProvider, startCrystalvaleMockServer, getCrystalvaleProvider } from './provider.mock';

describe("Heroes data access" , () => {
    let serendaleServer: TalkbackServer;
    let crystalvaleServer: TalkbackServer;

    describe("getHero(id)", () => {
        beforeAll(() => {
            serendaleServer = startSerendaleMockServer("heroes", "getHero");
            crystalvaleServer = startCrystalvaleMockServer("heroes", "getHero");
        });

        afterAll(() => {
            serendaleServer.close();
            crystalvaleServer.close();
        })

        it("should return a full set of hero data with valid ID", async () => {
            const id = BigInt("16639");

            const hero = await getHero(id, () => getSerendaleProvider());

            const expected = makeHero();

            expect(hero).toEqual(expected);
        });

        it("should return an error when the hero id does not exist", async () => {
            const id = BigInt("5000000");

            await expect(getHero(id, () => getSerendaleProvider())).rejects.toThrow("The hero id 5000000 does not exist");
        });

        it("should return a crystalvale hero from crystalvale when it is there", async () => {
            const id = BigInt("1000000000001");

            const hero = await getHero(id, () => getCrystalvaleProvider());

            expect(hero.id).toBe(1000000000001n);
        });

        it("should return an error when a crystalvale hero id does not exist", async () => {
            const id = BigInt("5000001");

            await expect(getHero(id, () => getCrystalvaleProvider())).rejects.toThrow("The hero id 5000001 does not exist");
        });
    });

    describe("getHeroes([ids])", () => {
        beforeAll(() => {
            serendaleServer = startSerendaleMockServer("heroes", "getHeroes");
            crystalvaleServer = startCrystalvaleMockServer("heroes", "getHero");
        });

        afterAll(() => {
            serendaleServer.close();
            crystalvaleServer.close();
        })

        it("should return an array of those heroes via concurrent request", async () => {
            const ids = [
                BigInt("19610"), 
                BigInt("39285"), 
                BigInt("43292"),
                BigInt("46555"),
                BigInt("48524"),
                BigInt("58413"),
                BigInt("135772"),
                BigInt("136587"),
                BigInt("137002"),
                BigInt("153953"),
                BigInt("155559"),
                BigInt("163201"),
                BigInt("164302"),
            ];

            const heroes = await getHeroes(ids, () => getSerendaleProvider());

            expect(heroes).toHaveLength(ids.length);
            const heroIds = heroes.map(h => h.id);

            expect(ids.sort()).toEqual(heroIds.sort());
        });

        it("should fail when any of the promises fail", async () => {
            const ids = [
                BigInt("19610"), 
                BigInt("5000001"), 
            ];

            await expect(getHeroes(ids, () => getSerendaleProvider())).rejects.toThrow("The hero id 5000001 does not exist");
        })
    });
    
});