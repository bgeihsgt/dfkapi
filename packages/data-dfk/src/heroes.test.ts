import { providers } from 'ethers';
import TalkbackServer from 'talkback/server';
import { getHero, HeroRarity, HeroClass, HeroStatus, Hero } from "./heroes";
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

            const expected: Hero = {
                id: BigInt("16639"),
                summonedTime: BigInt("1636277273"),
                nextSummonTime: BigInt("1639071247"),
                summonerId: BigInt("11621"),
                assistantId: BigInt("7400"),
                summons: 1,
                maxSummons: 8,
                statGenes: BigInt("169104949124006740833713545013310629570420355242807884221727877095229900"),
                visualGenes: BigInt("167423273338057992327143396655521143799658635409147523893565316370864131"),
                rarity: HeroRarity.Uncommon,
                shiny: false,
                generation: 2,
                firstName: 1730,
                lastName: 1898,
                shinyStyle: 13,
                mainClass: HeroClass.Pirate,
                subClass: HeroClass.Priest,
                staminaFullAt: BigInt("1653639976"),
                hpFullAt: BigInt("0"),
                mpFullAt: BigInt("0"),
                level: 5,
                xp: BigInt(1434),
                currentQuest: "0xADFFD2A255B3792873a986895c6312e8FbacFc8B",
                sp: 0,
                status: HeroStatus.Available,
                stats: {
                    strength: 13,
                    intelligence: 9,
                    wisdom: 8,
                    luck: 13,
                    agility: 13,
                    vitality: 12,
                    endurance: 10,
                    dexterity: 17,
                    hp: 279,
                    mp: 46,
                    stamina: 27,
                },
                growthPrimary: {
                    strength: 7000,
                    intelligence: 2000,
                    wisdom: 2000,
                    luck: 5500,
                    agility: 5000,
                    vitality: 6000,
                    endurance: 5500,
                    dexterity: 7200,
                    hpSmall: 1500,
                    hpRegular: 4500,
                    hpLarge: 4000,
                    mpSmall: 4500,
                    mpRegular: 4000,
                    mpLarge: 1500
                },
                growthSecondary: {
                    strength: 750,
                    intelligence: 1750,
                    wisdom: 2000,
                    luck: 1000,
                    agility: 1000,
                    vitality: 1250,
                    endurance: 1500,
                    dexterity: 1150,
                    hpSmall: 875,
                    hpRegular: 1000,
                    hpLarge: 625,
                    mpSmall: 375,
                    mpRegular: 875,
                    mpLarge: 1250
                },
                professions: {
                    mining: 0,
                    gardening: 0,
                    foraging: 0,
                    fishing: 164,
                }
            }

            expect(hero).toEqual(expected);
        });
    });
    
});