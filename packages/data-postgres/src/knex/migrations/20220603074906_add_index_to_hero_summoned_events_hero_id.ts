import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("hero_summoned_events", table => {
        table.index("hero_id");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("hero_summoned_events", table => {
        table.dropIndex("hero_id");
    });
}

