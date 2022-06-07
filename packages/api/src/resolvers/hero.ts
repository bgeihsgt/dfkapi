interface HeroResolverArgs {
    id: string
}

class Hero {
    id: string

    constructor(id: string) {
        this.id = id;
    }
}

export async function heroResolver(args: HeroResolverArgs): Promise<Hero> {
    return new Hero(args.id);
}