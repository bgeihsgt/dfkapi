import { getHero } from "@dfkapi/data-postgres";
import { Hero, HeroRarity, HeroRarityKey } from "@dfkapi/data-core";

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
    const hero = await getHero(BigInt(args.id));

    return new HeroResolver(hero.get());
}