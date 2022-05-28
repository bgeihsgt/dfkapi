import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('heroes', (table) => {
        table.bigInteger('id').primary();
        table.integer('main_class').notNullable();
        table.integer('sub_class').notNullable();
        table.integer('level').unsigned().notNullable();
        table.integer('generation').unsigned().notNullable();
        table.integer('max_summons').unsigned().notNullable();
        table.integer('summons').unsigned().notNullable();
        table.integer('rarity').unsigned().notNullable();
        table.integer('gardening').unsigned().notNullable();
        table.integer('fishing').unsigned().notNullable();
        table.integer('mining').unsigned().notNullable();
        table.integer('foraging').unsigned().notNullable();
        table.boolean('shiny').notNullable();
        table.bigInteger('stamina_full_at').unsigned().notNullable();
        table.bigInteger('hp_full_at').unsigned().notNullable();
        table.bigInteger('mp_full_at').unsigned().notNullable();
        table.bigInteger('xp').unsigned().notNullable();
        table.integer('sp').unsigned().notNullable();
        table.integer('status').unsigned().notNullable();
        table.integer('strength').unsigned().notNullable();
        table.integer('intelligence').unsigned().notNullable();
        table.integer('wisdom').unsigned().notNullable();
        table.integer('luck').unsigned().notNullable();
        table.integer('agility').unsigned().notNullable();
        table.integer('vitality').unsigned().notNullable();
        table.integer('endurance').unsigned().notNullable();
        table.integer('dexterity').unsigned().notNullable();
        table.integer('hp').unsigned().notNullable();
        table.integer('mp').unsigned().notNullable();
        table.integer('stamina').unsigned().notNullable();
        table.integer('strength_growth_primary').unsigned().notNullable();
        table.integer('intelligence_growth_primary').unsigned().notNullable();
        table.integer('wisdom_growth_primary').unsigned().notNullable();
        table.integer('luck_growth_primary').unsigned().notNullable();
        table.integer('agility_growth_primary').unsigned().notNullable();
        table.integer('vitality_growth_primary').unsigned().notNullable();
        table.integer('endurance_growth_primary').unsigned().notNullable();
        table.integer('dexterity_growth_primary').unsigned().notNullable();
        table.integer('strength_growth_secondary').unsigned().notNullable();
        table.integer('intelligence_growth_secondary').unsigned().notNullable();
        table.integer('wisdom_growth_secondary').unsigned().notNullable();
        table.integer('luck_growth_secondary').unsigned().notNullable();
        table.integer('agility_growth_secondary').unsigned().notNullable();
        table.integer('vitality_growth_secondary').unsigned().notNullable();
        table.integer('endurance_growth_secondary').unsigned().notNullable();
        table.integer('dexterity_growth_secondary').unsigned().notNullable();
        table.integer('hp_small_growth_primary').unsigned().notNullable();
        table.integer('hp_regular_growth_primary').unsigned().notNullable();
        table.integer('hp_large_growth_primary').unsigned().notNullable();
        table.integer('mp_small_growth_primary').unsigned().notNullable();
        table.integer('mp_regular_growth_primary').unsigned().notNullable();
        table.integer('mp_large_growth_primary').unsigned().notNullable();
        table.integer('hp_small_growth_secondary').unsigned().notNullable();
        table.integer('hp_regular_growth_secondary').unsigned().notNullable();
        table.integer('hp_large_growth_secondary').unsigned().notNullable();
        table.integer('mp_small_growth_secondary').unsigned().notNullable();
        table.integer('mp_regular_growth_secondary').unsigned().notNullable();
        table.integer('mp_large_growth_secondary').unsigned().notNullable();
        table.timestamp('summoned_time');
        table.timestamp('next_summon_time');
        table.bigInteger('summoner_id').notNullable();
        table.bigInteger('assistant_id').notNullable();
        table.string('stat_genes', 128).notNullable();
        table.string('visual_genes', 128).notNullable();
        table.integer('first_name').unsigned().notNullable();
        table.integer('last_name').unsigned().notNullable();
        table.integer('shiny_style').unsigned().notNullable();
        table.string('current_quest', 64).nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('heroes');
}

