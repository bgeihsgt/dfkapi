import { BigNumber, providers } from "ethers";
import { getHero as getContractHero, ContractArray } from "./contracts/hero";

export enum HeroRarity {
    Common = 0,
    Uncommon = 1,
    Rare = 2,
    Legendary = 3,
    Mythic = 4
}

export enum HeroClass {
    Priest = 4,
    Pirate = 7
}

export enum HeroStatus {
    Available = 0
}

export interface HeroStatGrowth {
    strength: number,
    intelligence: number,
    wisdom: number,
    luck: number,
    agility: number,
    vitality: number,
    endurance: number,
    dexterity: number,
    hpSmall: number,
    hpRegular: number,
    hpLarge: number,
    mpSmall: number,
    mpRegular: number,
    mpLarge: number
}

export interface Hero {
    id: bigint,
    rarity: HeroRarity,
    summonedTime: bigint,
    nextSummonTime: bigint,
    summonerId: bigint,
    assistantId: bigint,
    summons: number,
    maxSummons: number,
    statGenes: bigint,
    visualGenes: bigint,
    shiny: boolean,
    generation: number,
    firstName: number,
    lastName: number,
    shinyStyle: number,
    mainClass: HeroClass,
    subClass: HeroClass,
    staminaFullAt: bigint,
    hpFullAt: bigint,
    mpFullAt: bigint,
    level: number,
    xp: bigint,
    currentQuest: string,
    sp: number,
    status: HeroStatus,
    stats: {
        strength: number,
        intelligence: number,
        wisdom: number,
        luck: number,
        agility: number,
        vitality: number,
        endurance: number,
        dexterity: number,
        hp: number,
        mp: number,
        stamina: number,
    },
    growthPrimary: HeroStatGrowth,
    growthSecondary: HeroStatGrowth,
    professions: {
        mining: number,
        gardening: number,
        foraging: number,
        fishing: number,
    }
}

function contractHeroToHero(contractHero: ContractArray): Hero {
    const rawSummingInfo = (contractHero[1] as ContractArray);
    const rawInfo = (contractHero[2] as ContractArray);
    const rawStatus = (contractHero[3] as ContractArray);
    const rawStats = (contractHero[4] as ContractArray);
    const rawPrimaryGrowth = (contractHero[5] as ContractArray);
    const rawSecondaryGrowth = (contractHero[6] as ContractArray);
    const rawProfessions = (contractHero[7] as ContractArray);


    return {
        id: (contractHero[0] as BigNumber).toBigInt(),
        summonedTime: (rawSummingInfo[0] as BigNumber).toBigInt(),
        nextSummonTime: (rawSummingInfo[1] as BigNumber).toBigInt(),
        summonerId: (rawSummingInfo[2] as BigNumber).toBigInt(),
        assistantId: (rawSummingInfo[3] as BigNumber).toBigInt(),
        summons: rawSummingInfo[4] as number,
        maxSummons: rawSummingInfo[5] as number,
        statGenes: (rawInfo[0] as BigNumber).toBigInt(),
        visualGenes: (rawInfo[1] as BigNumber).toBigInt(),
        rarity: (rawInfo[2] as HeroRarity),
        shiny: (rawInfo[3] as boolean),
        generation: (rawInfo[4] as number),
        firstName: (rawInfo[5] as number),
        lastName: (rawInfo[6] as number),
        shinyStyle: (rawInfo[7] as number),
        mainClass: (rawInfo[8] as number),
        subClass: (rawInfo[9] as number),
        staminaFullAt: (rawStatus[0] as BigNumber).toBigInt(),
        hpFullAt: (rawStatus[1] as BigNumber).toBigInt(),
        mpFullAt: (rawStatus[2] as BigNumber).toBigInt(),
        level: (rawStatus[3] as number),
        xp: (rawStatus[4] as BigNumber).toBigInt(),
        currentQuest: (rawStatus[5] as string),
        sp: (rawStatus[6] as number),
        status: (rawStatus[7] as number),
        stats: {
            strength: rawStats[0] as number,
            intelligence: rawStats[1] as number,
            wisdom: rawStats[2] as number,
            luck: rawStats[3] as number,
            agility: rawStats[4] as number,
            vitality: rawStats[5] as number,
            endurance: rawStats[6] as number,
            dexterity: rawStats[7] as number,
            hp: rawStats[8] as number,
            mp: rawStats[9] as number,
            stamina: rawStats[10] as number,
        },
        growthPrimary: {
            strength: rawPrimaryGrowth[0] as number,
            intelligence: rawPrimaryGrowth[1] as number,
            wisdom: rawPrimaryGrowth[2] as number,
            luck: rawPrimaryGrowth[3] as number,
            agility: rawPrimaryGrowth[4] as number,
            vitality: rawPrimaryGrowth[5] as number,
            endurance: rawPrimaryGrowth[6] as number,
            dexterity: rawPrimaryGrowth[7] as number,
            hpSmall: rawPrimaryGrowth[8] as number,
            hpRegular: rawPrimaryGrowth[9] as number,
            hpLarge: rawPrimaryGrowth[10] as number,
            mpSmall: rawPrimaryGrowth[11] as number,
            mpRegular: rawPrimaryGrowth[12] as number,
            mpLarge: rawPrimaryGrowth[13] as number,
        },
        growthSecondary: {
            strength: rawSecondaryGrowth[0] as number,
            intelligence: rawSecondaryGrowth[1] as number,
            wisdom: rawSecondaryGrowth[2] as number,
            luck: rawSecondaryGrowth[3] as number,
            agility: rawSecondaryGrowth[4] as number,
            vitality: rawSecondaryGrowth[5] as number,
            endurance: rawSecondaryGrowth[6] as number,
            dexterity: rawSecondaryGrowth[7] as number,
            hpSmall: rawSecondaryGrowth[8] as number,
            hpRegular: rawSecondaryGrowth[9] as number,
            hpLarge: rawSecondaryGrowth[10] as number,
            mpSmall: rawSecondaryGrowth[11] as number,
            mpRegular: rawSecondaryGrowth[12] as number,
            mpLarge: rawSecondaryGrowth[13] as number,
        },
        professions: {
            mining: rawProfessions[0] as number,
            gardening: rawProfessions[1] as number,
            foraging: rawProfessions[2] as number,
            fishing: rawProfessions[3] as number,
        }
    };
}

export async function getHero(id: bigint, provider?: providers.Provider): Promise<Hero> {
    const contractHero = await getContractHero(id, provider);
    return contractHeroToHero(contractHero);
}