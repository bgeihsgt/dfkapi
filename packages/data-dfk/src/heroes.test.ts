import { providers } from 'ethers';
import TalkbackServer from 'talkback/server';
import { getHero, getHeroes } from "./heroes";
import { makeHero } from "@dfkapi/data-core/src/testdata";
import { startSerendaleMockServer, getSerendaleProvider } from './provider.mock';

describe("Heroes data access" , () => {
    let provider: providers.Provider;
    let server: TalkbackServer;

    describe("getHero(id)", () => {
        beforeAll(() => {
            server = startSerendaleMockServer("heroes", "getHero");
        });

        afterAll(() => {
            server.close();
        })

        it("should return a full set of hero data with valid ID", async () => {
            const id = BigInt("16639");

            const hero = await getHero(id, () => getSerendaleProvider());

            const expected = makeHero();

            expect(hero).toEqual(expected);
        });
    });

    describe("getHeroes([ids])", () => {
        beforeAll(() => {
            server = startSerendaleMockServer("heroes", "getHeroes");
        });

        afterAll(() => {
            server.close();
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
    });
    
});