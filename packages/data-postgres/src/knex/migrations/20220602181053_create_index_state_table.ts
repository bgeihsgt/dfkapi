import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable("index_state", table => {
        table.integer("chain_id").unsigned().notNullable().references("chains.id");
        table.string("name", 64).notNullable();
        table.integer("block_number").unsigned().notNullable();
        table.timestamps(true, true);

        table.primary(["chain_id", "name"]);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("index_state");
}

