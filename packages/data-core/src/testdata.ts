import { BlockchainEvent, HeroSummonedEvent } from "../lib";
import { Hero, HeroClass, HeroStatus, HeroRarity } from "./";

interface HeroOptions {
    id?: bigint
}

export function makeHero(options?: HeroOptions): Hero {
    return {
        id: options?.id || BigInt("16639"),
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
        staminaFullAt: BigInt("1653692699"),
        hpFullAt: BigInt("0"),
        mpFullAt: BigInt("0"),
        level: 5,
        xp: BigInt(1512),
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
    };
}

interface HeroSummonedEventOptions {
    logIndex?: number,
    heroId?: bigint
}

export function makeHeroSummonedEvent(options?: HeroSummonedEventOptions): BlockchainEvent<HeroSummonedEvent> {
    return {
        blockNumber: 2704539,
        address: "0xEb9B61B145D6489Be575D3603F4a704810e143dF",
        blockHash: "0xd4a74a67f28fcd3ef360b8c28a3e9a42dcfd0f37068f46e447b941c7d0c60c10",
        logIndex: options?.logIndex || 0,
        rawData: "0x000000000000000000000000000000000000000000000000000000e8d4a513c3000000000000000000000000000000000000000000000000000000000001e9dc0000000000000000000000000000000000000000000000000000000000021e0b0000308c1290a1000c2304a420ca720841190867388c7294a188812098c308c2000018c6318c40288e3729c2110063000738821418847118209c8411c6301c04",
        removed: false,
        transactionHash: "0xb4ebf760fb4fb93fa6580fe3723f3ebae8002908b1d13cba890e79fafa0241d6",
        transactionIndex: 1,
        data: {
            owner: '0x99c71df5B17538b0CF10F6FdDaD18766349A7606',
            heroId: options?.heroId || 1000000000963n,
            summonerId: 125404n,
            assistantId: 138763n,
            statGenes: 335060172297479571679811471009455345990633112149212708157934403571615938n,
            visualGenes: 170985199761119229137574546544909115454800841947938051489981624386329604n
        }
    };
}