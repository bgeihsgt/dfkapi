import { BlockchainEvent, Hero, HeroSummonedEvent, HeroChainInfo } from "@dfkapi/data-core";
import { unixTimeToTimestamp, timestampToUnixTime } from "./datetime";
import knex from './knex';
import pMap from 'p-map';
import { Optional } from 'typescript-optional';

function heroToPgHero(hero: Hero, chainInfo: HeroChainInfo): Object {
    return {
        id: hero.id,
        main_class: hero.mainClass,
        sub_class: hero.subClass,
        level: hero.level,
        generation: hero.generation,
        max_summons: hero.maxSummons,
        summons: hero.summons,
        rarity: hero.rarity,
        gardening: hero.professions.gardening,
        fishing: hero.professions.fishing,
        mining: hero.professions.mining,
        foraging: hero.professions.foraging,
        shiny: hero.shiny,
        stamina_full_at: hero.staminaFullAt,
        hp_full_at: hero.hpFullAt,
        mp_full_at: hero.mpFullAt,
        xp: hero.xp,
        sp: hero.sp,
        status: hero.status,
        strength: hero.stats.strength,
        intelligence: hero.stats.intelligence,
        wisdom: hero.stats.wisdom,
        luck: hero.stats.luck,
        agility: hero.stats.agility,
        vitality: hero.stats.vitality,
        endurance: hero.stats.endurance,
        dexterity: hero.stats.dexterity,
        hp: hero.stats.hp,
        mp: hero.stats.mp,
        stamina: hero.stats.stamina,
        strength_growth_primary: hero.growthPrimary.strength,
        intelligence_growth_primary: hero.growthPrimary.intelligence,
        wisdom_growth_primary: hero.growthPrimary.wisdom,
        luck_growth_primary: hero.growthPrimary.luck,
        agility_growth_primary: hero.growthPrimary.agility,
        vitality_growth_primary: hero.growthPrimary.vitality,
        endurance_growth_primary: hero.growthPrimary.endurance,
        dexterity_growth_primary: hero.growthPrimary.dexterity,
        hp_small_growth_primary: hero.growthPrimary.hpSmall,
        hp_regular_growth_primary: hero.growthPrimary.hpRegular,
        hp_large_growth_primary: hero.growthPrimary.hpLarge,
        mp_small_growth_primary: hero.growthPrimary.mpSmall,
        mp_regular_growth_primary: hero.growthPrimary.mpRegular,
        mp_large_growth_primary: hero.growthPrimary.mpLarge,
        strength_growth_secondary: hero.growthSecondary.strength,
        intelligence_growth_secondary: hero.growthSecondary.intelligence,
        wisdom_growth_secondary: hero.growthSecondary.wisdom,
        luck_growth_secondary: hero.growthSecondary.luck,
        agility_growth_secondary: hero.growthSecondary.agility,
        vitality_growth_secondary: hero.growthSecondary.vitality,
        endurance_growth_secondary: hero.growthSecondary.endurance,
        dexterity_growth_secondary: hero.growthSecondary.dexterity,
        hp_small_growth_secondary: hero.growthSecondary.hpSmall,
        hp_regular_growth_secondary: hero.growthSecondary.hpRegular,
        hp_large_growth_secondary: hero.growthSecondary.hpLarge,
        mp_small_growth_secondary: hero.growthSecondary.mpSmall,
        mp_regular_growth_secondary: hero.growthSecondary.mpRegular,
        mp_large_growth_secondary: hero.growthSecondary.mpLarge,
        summoned_time: unixTimeToTimestamp(hero.summonedTime),
        next_summon_time: unixTimeToTimestamp(hero.nextSummonTime),
        summoner_id: hero.summonerId,
        assistant_id: hero.assistantId,
        stat_genes: hero.statGenes,
        visual_genes: hero.visualGenes,
        first_name: hero.firstName,
        last_name: hero.lastName,
        shiny_style: hero.shinyStyle,
        current_quest: hero.currentQuest,
        current_chain_id: chainInfo.currentChainId,
        summoned_chain_id: chainInfo.summonedChainId,
        updated_at: new Date().toUTCString()
    };
}

function pgHeroToHero(pgHero: any): Hero {
    return {
        id: BigInt(pgHero.id),
        mainClass: pgHero.main_class,
        subClass: pgHero.sub_class,
        level: pgHero.level,
        generation: pgHero.generation,
        maxSummons: pgHero.max_summons,
        summons: pgHero.summons,
        rarity: pgHero.rarity,
        professions: {
            gardening: pgHero.gardening,
            fishing: pgHero.fishing,
            mining: pgHero.mining,
            foraging: pgHero.foraging
        },
        shiny: pgHero.shiny,
        staminaFullAt: BigInt(pgHero.stamina_full_at),
        hpFullAt: BigInt(pgHero.hp_full_at),
        mpFullAt: BigInt(pgHero.mp_full_at),
        xp: BigInt(pgHero.xp),
        sp: pgHero.sp,
        status: pgHero.status,
        stats: {
            strength: pgHero.strength,
            intelligence: pgHero.intelligence,
            wisdom: pgHero.wisdom,
            luck: pgHero.luck,
            agility: pgHero.agility,
            vitality: pgHero.vitality,
            endurance: pgHero.endurance,
            dexterity: pgHero.dexterity,
            hp: pgHero.hp,
            mp: pgHero.mp,
            stamina: pgHero.stamina,
        },
        growthPrimary: {
            strength: pgHero.strength_growth_primary,
            intelligence: pgHero.intelligence_growth_primary,
            wisdom: pgHero.wisdom_growth_primary,
            luck: pgHero.luck_growth_primary,
            agility: pgHero.agility_growth_primary,
            vitality: pgHero.vitality_growth_primary,
            endurance: pgHero.endurance_growth_primary,
            dexterity: pgHero.dexterity_growth_primary,
            hpSmall: pgHero.hp_small_growth_primary,
            hpRegular: pgHero.hp_regular_growth_primary,
            hpLarge: pgHero.hp_large_growth_primary,
            mpSmall: pgHero.mp_small_growth_primary,
            mpRegular: pgHero.mp_regular_growth_primary,
            mpLarge: pgHero.mp_large_growth_primary
        },
        growthSecondary: {
            strength: pgHero.strength_growth_secondary,
            intelligence: pgHero.intelligence_growth_secondary,
            wisdom: pgHero.wisdom_growth_secondary,
            luck: pgHero.luck_growth_secondary,
            agility: pgHero.agility_growth_secondary,
            vitality: pgHero.vitality_growth_secondary,
            endurance: pgHero.endurance_growth_secondary,
            dexterity: pgHero.dexterity_growth_secondary,
            hpSmall: pgHero.hp_small_growth_secondary,
            hpRegular: pgHero.hp_regular_growth_secondary,
            hpLarge: pgHero.hp_large_growth_secondary,
            mpSmall: pgHero.mp_small_growth_secondary,
            mpRegular: pgHero.mp_regular_growth_secondary,
            mpLarge: pgHero.mp_large_growth_secondary
        },
        summonedTime: timestampToUnixTime(pgHero.summoned_time),
        nextSummonTime: timestampToUnixTime(pgHero.next_summon_time),
        summonerId: BigInt(pgHero.summoner_id),
        assistantId: BigInt(pgHero.assistant_id),
        statGenes: BigInt(pgHero.stat_genes),
        visualGenes: BigInt(pgHero.visual_genes),
        firstName: pgHero.first_name,
        lastName: pgHero.last_name,
        shinyStyle: pgHero.shiny_style,
        currentQuest: pgHero.current_quest,
        chainInfo: {
            summonedChainId: pgHero.summoned_chain_id,
            currentChainId: pgHero.current_chain_id
        }
    };
}

export async function upsertHero(hero: Hero, chainInfo: HeroChainInfo) {
    await knex('heroes').insert(heroToPgHero(hero, chainInfo)).onConflict('id').merge();
}

export async function getHero(id: bigint): Promise<Optional<Hero>> {
    const pgHero = await knex('heroes').select([
        'id',
        'main_class',
        'sub_class',
        'level',
        'generation',
        'max_summons',
        'summons',
        'rarity',
        'gardening',
        'fishing',
        'mining',
        'foraging',
        'shiny',
        'stamina_full_at',
        'hp_full_at',
        'mp_full_at',
        'xp',
        'sp',
        'status',
        'strength',
        'intelligence',
        'wisdom',
        'luck',
        'agility',
        'vitality',
        'endurance',
        'dexterity',
        'hp',
        'mp',
        'stamina',
        'strength_growth_primary',
        'intelligence_growth_primary',
        'wisdom_growth_primary',
        'luck_growth_primary',
        'agility_growth_primary',
        'vitality_growth_primary',
        'endurance_growth_primary',
        'dexterity_growth_primary',
        'strength_growth_secondary',
        'intelligence_growth_secondary',
        'wisdom_growth_secondary',
        'luck_growth_secondary',
        'agility_growth_secondary',
        'vitality_growth_secondary',
        'endurance_growth_secondary',
        'dexterity_growth_secondary',
        'hp_small_growth_primary',
        'hp_regular_growth_primary',
        'hp_large_growth_primary',
        'mp_small_growth_primary',
        'mp_regular_growth_primary',
        'mp_large_growth_primary',
        'hp_small_growth_secondary',
        'hp_regular_growth_secondary',
        'hp_large_growth_secondary',
        'mp_small_growth_secondary',
        'mp_regular_growth_secondary',
        'mp_large_growth_secondary',
        'summoned_time',
        'next_summon_time',
        'summoner_id',
        'assistant_id',
        'stat_genes',
        'visual_genes',
        'first_name',
        'last_name',
        'shiny_style',
        'current_quest',
        "summoned_chain_id",
        "current_chain_id"
    ]).where('id', id.toString());

    if (pgHero.length > 0) {
        return Optional.of(pgHeroToHero(pgHero[0]));
    }

    return Optional.empty();
}

export async function upsertHeroSummonedEvent(heroSummonedEvent: BlockchainEvent<HeroSummonedEvent>, chainId: number) {
    const pgEvent = {
        transaction_hash: heroSummonedEvent.transactionHash,
        block_number: heroSummonedEvent.blockNumber,
        removed: heroSummonedEvent.removed,
        address: heroSummonedEvent.address,
        log_index: heroSummonedEvent.logIndex,
        transaction_index: heroSummonedEvent.transactionIndex,
        owner: heroSummonedEvent.data.owner,
        hero_id: heroSummonedEvent.data.heroId,
        summoner_id: heroSummonedEvent.data.summonerId,
        assistant_id: heroSummonedEvent.data.assistantId,
        stat_genes: heroSummonedEvent.data.statGenes,
        visual_genes: heroSummonedEvent.data.visualGenes,
        chain_id: chainId,
        updated_at: new Date().toUTCString()
    }

    await knex('hero_summoned_events').insert(pgEvent).onConflict(["chain_id", "transaction_hash", "log_index"]).merge();
}

export async function upsertHeroSummonedEvents(heroSummonedEvents: BlockchainEvent<HeroSummonedEvent>[], chainId: number) {
    const mapper = async (e: BlockchainEvent<HeroSummonedEvent>) => {
        await upsertHeroSummonedEvent(e, chainId);
    }

    await pMap(heroSummonedEvents, mapper, { concurrency: 10 });
}

export async function paginateAllSummonedHeroIds(chainId: number, callback: (ids: bigint[]) => Promise<void>, pageSize: number = 1000) {
    let results = [];
    let offset = 0;

    do {
        results = await knex("hero_summoned_events")
            .select("hero_id")
            .where("chain_id", chainId)
            .orderBy("hero_id")
            .offset(offset)
            .limit(pageSize);

        offset += pageSize;

        if (results.length > 0) {
            callback(results.map(r => BigInt(r.hero_id)));
        }
    } while(results.length > 0);
}