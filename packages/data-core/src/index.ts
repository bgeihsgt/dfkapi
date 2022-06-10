export type HeroRarityKey = keyof typeof HeroRarity;

export enum HeroRarity {
    Common = 0,
    Uncommon = 1,
    Rare = 2,
    Legendary = 3,
    Mythic = 4
}

export type HeroClassKey = keyof typeof HeroClass;

export enum HeroClass {
    Warrior = 0,
    Knight = 1,
    Thief = 2,
    Archer = 3,
    Priest = 4,
    Wizard = 5,
    Monk = 6,
    Pirate = 7,
    Berserker = 8,
    Seer = 9,
    Paladin = 16,
    Darkknight = 17,
    Summoner = 18,
    Ninja = 19,
    Shapeshifter = 20,
    Dragoon = 24,
    Sage = 25,
    Dreadknight = 28
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

export interface HeroChainInfo {
    summonedChainId: number,
    currentChainId: number
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
    },
    chainInfo?: HeroChainInfo
}

export interface BlockchainEvent<T> {
    blockNumber: number,
    blockHash: string,
    transactionIndex: number,
    removed: boolean,
    address: string,
    rawData: string,
    transactionHash: string,
    logIndex: number,
    data: T,
    timestamp: number
}

export interface HeroSummonedEvent {
    owner: string,
    heroId: bigint,
    summonerId: bigint,
    assistantId: bigint,
    statGenes: bigint,
    visualGenes: bigint
}

export { retry } from './retry';