import TalkbackServer from 'talkback/server';
import { getHero, getHeroes, getHeroSummonedEvents } from "./heroes";
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

    describe("getHeroSummonedEvents", () => {
        beforeAll(() => {
            serendaleServer = startSerendaleMockServer("heroes", "getHeroSummonedEvents");
            crystalvaleServer = startCrystalvaleMockServer("heroes", "getHeroSummonedEvents");
        });

        afterAll(() => {
            serendaleServer.close();
            crystalvaleServer.close();
        });

        it("should retrieve the serendale events", async () => {
            const summoningEvents = await getHeroSummonedEvents(25_000_000, 25_000_999, () => getSerendaleProvider());

            expect(summoningEvents.length).toBe(10);
            expect(summoningEvents[0]).toEqual({
                blockNumber: 25000163,
                address: "0x5F753dcDf9b1AD9AabC1346614D1f4746fd6Ce5C",
                blockHash: "0x04b8172ed88071f618670431c9e210a91114742a9fdbe30119322abe720d613b",
                logIndex: 134,
                rawData: "0x0000000000000000000000000000000000000000000000000000000000028b5e000000000000000000000000000000000000000000000000000000000001abb0000000000000000000000000000000000000000000000000000000000001d4af000000c3021427318c00142220cc2290c4298a06314a70186214a21004e011c400000846108063140c73118a100b201c20318a51094e00042004a22144339066",
                removed: false,
                transactionHash: "0x1d06ef907d6c763ca081d47b0904a885f3180e7b05425fc367709b0ca4998ab9",
                transactionIndex: 5,
                data: {
                    owner: '0xA333024B407f9f6650F1eea335dF2E00bb27ef70',
                    heroId: 166750n,
                    summonerId: 109488n,
                    assistantId: 119983n,
                    statGenes: 5257408515182092989042548926348545719780699390499442168630991631946180n,
                    visualGenes: 57102904853050299955550804663505743829002160563649143990302999558983782n
                }
            });
            expect(summoningEvents[9]).toEqual({
                blockNumber: 25000941,
                address: "0x5F753dcDf9b1AD9AabC1346614D1f4746fd6Ce5C",
                blockHash: "0x88f680059a42ace8cce6b4984a5ca3ab75c415581233a9b5cacf607477cf4ca7",
                logIndex: 90,
                rawData: "0x0000000000000000000000000000000000000000000000000000000000028b6700000000000000000000000000000000000000000000000000000000000286f600000000000000000000000000000000000000000000000000000000000286e9000030072218b121800090a4388c71948028800539884180c018e72200e63106000008c63388c6314c1700cc39006394c0114c31204a72088394830084701c85",
                removed: false,
                transactionHash: "0xd404b6497edeca9193d2c4bd1ce1069977f121f1e54cd4b4aa5ef26dc29785d4",
                transactionIndex: 13,
                data: {
                    owner: "0x4fefD1eB4528683eBACe38B5263f378e582F6ab9",
                    heroId: 166759n,
                    summonerId: 165622n,
                    assistantId: 165609n,
                    statGenes: 331476135048199507943108470676748876197845543282775454623992534698176774n,
                    visualGenes: 60557467406933558782501669559277784793655285602216151966589082856856709n
                }
            });
        });

        it("should receive crystalvale events", async () => {
            const summoningEvents = await getHeroSummonedEvents(2_704_000, 2_704_999, () => getCrystalvaleProvider());

            expect(summoningEvents.length).toBe(1);
            expect(summoningEvents[0]).toEqual({
                blockNumber: 2704539,
                address: "0xEb9B61B145D6489Be575D3603F4a704810e143dF",
                blockHash: "0xd4a74a67f28fcd3ef360b8c28a3e9a42dcfd0f37068f46e447b941c7d0c60c10",
                logIndex: 0,
                rawData: "0x000000000000000000000000000000000000000000000000000000e8d4a513c3000000000000000000000000000000000000000000000000000000000001e9dc0000000000000000000000000000000000000000000000000000000000021e0b0000308c1290a1000c2304a420ca720841190867388c7294a188812098c308c2000018c6318c40288e3729c2110063000738821418847118209c8411c6301c04",
                removed: false,
                transactionHash: "0xb4ebf760fb4fb93fa6580fe3723f3ebae8002908b1d13cba890e79fafa0241d6",
                transactionIndex: 1,
                data: {
                    owner: '0x99c71df5B17538b0CF10F6FdDaD18766349A7606',
                    heroId: 1000000000963n,
                    summonerId: 125404n,
                    assistantId: 138763n,
                    statGenes: 335060172297479571679811471009455345990633112149212708157934403571615938n,
                    visualGenes: 170985199761119229137574546544909115454800841947938051489981624386329604n
                }
            });
        });

        it("should split blocks distances than 1000 into chunks and run them in parallel", async () => {
            const summoningEvents = await getHeroSummonedEvents(25_000_000, 25_010_200, () => getSerendaleProvider());

            expect(summoningEvents.length).toBe(196);
            expect(summoningEvents[0].data.heroId).toBe(166750n);
            expect(summoningEvents[195].data.heroId).toBe(166945n)
        });

        it("should receive empty array for no events (SD)", async () => {
            const summoningEvents = await getHeroSummonedEvents(2_703_000, 2_703_999, () => getSerendaleProvider());

            expect(summoningEvents).toEqual([]);
        });

        it("should receive empty array for no events (CV)", async () => {
            const summoningEvents = await getHeroSummonedEvents(2_703_000, 2_703_999, () => getCrystalvaleProvider());

            expect(summoningEvents).toEqual([]);
        });

    });
    
});