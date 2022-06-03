import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return await knex.schema.alterTable("heroes", table => {
        table.integer("summoned_chain_id").notNullable().references("chains.id");
        table.integer("current_chain_id").notNullable().references("chains.id");
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return await knex.schema.alterTable("heroes", table => {
        table.dropColumns("summoned_chain_id", "current_chain_id", "updated_at", "created_at");
    });
}

