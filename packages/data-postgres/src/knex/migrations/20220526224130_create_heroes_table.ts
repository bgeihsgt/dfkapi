import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('heroes', (table) => {
        table.integer('id').primary();
        table.string('main_class', 64).notNullable();
        table.string('sub_class', 64).notNullable();
        table.integer('level').unsigned().notNullable();
        table.integer('generation').unsigned().notNullable();
        table.integer('max_summons').unsigned().notNullable();
        table.integer('summons_remaining').unsigned().notNullable();
        table.integer('summons').unsigned().notNullable();
        table.integer('rarity').unsigned().notNullable();
        table.string('profession', 64).notNullable();
        table.integer('gardening').unsigned().notNullable();
        table.integer('fishing').unsigned().notNullable();
        table.integer('mining').unsigned().notNullable();
        table.integer('foraging').unsigned().notNullable();
        table.boolean('shiny').notNullable();
        table.integer('stamina_full_at').unsigned().notNullable();
        table.integer('hp_full_at').unsigned().notNullable();
        table.integer('mp_full_at').unsigned().notNullable();
        table.integer('xp').unsigned().notNullable();
        table.integer('sp').unsigned().notNullable();
        table.string('status', 64).notNullable();
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
        table.integer('hp_small_growth').unsigned().notNullable();
        table.integer('hp_regular_growth').unsigned().notNullable();
        table.integer('hp_large_growth').unsigned().notNullable();
        table.integer('mp_small_growth').unsigned().notNullable();
        table.integer('mp_regular_growth').unsigned().notNullable();
        table.integer('mp_large_growth').unsigned().notNullable();
        table.string('pj_status', 100).nullable();
        table.integer('pj_level').nullable();
        table.string('owner', 100).nullable();
        table.string('previous_owner', 100).nullable();
        table.string('creator', 100);
        table.timestamp('summoned_time');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('heroes');
}

