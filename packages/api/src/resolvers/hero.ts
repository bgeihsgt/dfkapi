import { getHero } from "@dfkapi/data-postgres";
import { Hero, HeroRarity, HeroRarityKey } from "@dfkapi/data-core";
import { parseBigInt } from '../util';

interface HeroResolverArgs {
    id: string
}

class HeroResolver {
    id: string
    rarity: HeroRarity
    rarityString: string;

    constructor(hero: Hero) {
        this.id = hero.id.toString();
        this.rarity = hero.rarity;
        this.rarityString = HeroRarity[hero.rarity];
    }
}

export async function heroResolver(args: HeroResolverArgs): Promise<HeroResolver> {
    const id = parseBigInt(args.id);

    if (id.isEmpty()) {
        throw new Error(`"${args.id}" is not a valid hero ID`);
    }

    const hero = await getHero(BigInt(args.id));

    if (hero.isEmpty()) {
        throw new Error(`Hero with ID "${args.id}" does not exist`);
    }

    return new HeroResolver(hero.get());
}