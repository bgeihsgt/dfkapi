import { providers } from 'ethers';
import TalkbackServer from 'talkback/server';
import { getHero } from "./heroes";
import { makeHero } from "@dfkapi/data-core/src/testdata";
import { startSerendaleMockServer, getSerendaleProvider } from './provider.mock';

describe("Heroes data access" , () => {
    let provider: providers.Provider;
    let server: TalkbackServer;

    beforeAll(() => {
        server = startSerendaleMockServer();
        provider = getSerendaleProvider();
    });

    afterAll(() => {
        server.close();
    });

    describe("getHero(id)", () => {
        it("should return a full set of hero data with valid ID", async () => {
            const id = BigInt("16639");

            const hero = await getHero(id, provider);

            const expected = makeHero();

            expect(hero).toEqual(expected);
        });
    });
    
});