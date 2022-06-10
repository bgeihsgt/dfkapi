import { getHero } from "@dfkapi/data-postgres";
import { Hero, HeroRarity, HeroClass } from "@dfkapi/data-core";
import { parseBigInt } from '../util';
import { NotFoundError } from '../customErrors';

interface HeroResolverArgs {
    id: string
}

class HeroResolver {
    id: string;
    rarity: HeroRarity;
    rarityString: string;
    summonedTime: number;
    maxSummons: number;
    statGenes: string;
    visualGenes: string;
    shiny: boolean;
    shinyStyle: number;
    generation: number;
    firstName: number;
    lastName: number;
    mainClass: string;
    mainClassNumber: number;
    subClass: string;
    subClassNumber: number;
    strengthGrowthP: number;
    intelligenceGrowthP: number;
    wisdomGrowthP: number;
    luckGrowthP: number;
    agilityGrowthP: number;
    vitalityGrowthP: number;
    enduranceGrowthP: number;
    dexterityGrowthP: number;
    hpSmGrowth: number;
    hpRgGrowth: number;
    hpLgGrowth: number;
    mpSmGrowth: number;
    mpRgGrowth: number;
    mpLgGrowth: number;
    strengthGrowthS: number;
    intelligenceGrowthS: number;
    wisdomGrowthS: number;
    luckGrowthS: number;
    agilityGrowthS: number;
    vitalityGrowthS: number;
    enduranceGrowthS: number;
    dexterityGrowthS: number;
    hpSmGrowthS: number;
    hpRgGrowthS: number;
    hpLgGrowthS: number;
    mpSmGrowthS: number;
    mpRgGrowthS: number;
    mpLgGrowthS: number;

    constructor(hero: Hero) {
        this.id = hero.id.toString();
        this.rarity = hero.rarity;
        this.rarityString = HeroRarity[hero.rarity];
        this.summonedTime = Number(hero.summonedTime);
        this.maxSummons = hero.maxSummons;
        this.statGenes = hero.statGenes.toString();
        this.visualGenes = hero.visualGenes.toString();
        this.shiny = hero.shiny;
        this.shinyStyle = hero.shinyStyle;
        this.generation = hero.generation;
        this.firstName = hero.firstName;
        this.lastName = hero.lastName;
        this.mainClass = HeroClass[hero.mainClass];
        this.mainClassNumber = hero.mainClass;
        this.subClass = HeroClass[hero.subClass];
        this.subClassNumber = hero.subClass;
        this.strengthGrowthP = hero.growthPrimary.strength;
        this.intelligenceGrowthP = hero.growthPrimary.intelligence;
        this.wisdomGrowthP = hero.growthPrimary.wisdom;
        this.luckGrowthP = hero.growthPrimary.luck;
        this.agilityGrowthP = hero.growthPrimary.agility;
        this.vitalityGrowthP = hero.growthPrimary.vitality;
        this.enduranceGrowthP = hero.growthPrimary.endurance;
        this.dexterityGrowthP = hero.growthPrimary.dexterity;
        this.hpSmGrowth = hero.growthPrimary.hpSmall;
        this.hpRgGrowth = hero.growthPrimary.hpRegular;
        this.hpLgGrowth = hero.growthPrimary.hpLarge;
        this.mpSmGrowth = hero.growthPrimary.mpSmall;
        this.mpRgGrowth = hero.growthPrimary.mpRegular;
        this.mpLgGrowth = hero.growthPrimary.mpLarge;
        this.strengthGrowthS = hero.growthSecondary.strength;
        this.intelligenceGrowthS = hero.growthSecondary.intelligence;
        this.wisdomGrowthS = hero.growthSecondary.wisdom;
        this.luckGrowthS = hero.growthSecondary.luck;
        this.agilityGrowthS = hero.growthSecondary.agility;
        this.vitalityGrowthS = hero.growthSecondary.vitality;
        this.enduranceGrowthS = hero.growthSecondary.endurance;
        this.dexterityGrowthS = hero.growthSecondary.dexterity;
        this.hpSmGrowthS = hero.growthSecondary.hpSmall;
        this.hpRgGrowthS = hero.growthSecondary.hpRegular;
        this.hpLgGrowthS = hero.growthSecondary.hpLarge;
        this.mpSmGrowthS = hero.growthSecondary.mpSmall;
        this.mpRgGrowthS = hero.growthSecondary.mpRegular;
        this.mpLgGrowthS = hero.growthSecondary.mpLarge;
    }
}

export async function heroResolver(args: HeroResolverArgs): Promise<HeroResolver> {
    const id = parseBigInt(args.id);

    if (id.isEmpty()) {
        throw new NotFoundError(`"${args.id}" is not a valid hero ID`);
    }

    const hero = await getHero(BigInt(args.id));

    if (hero.isEmpty()) {
        throw new NotFoundError(`Hero with ID "${args.id}" does not exist`);
    }

    return new HeroResolver(hero.get());
}