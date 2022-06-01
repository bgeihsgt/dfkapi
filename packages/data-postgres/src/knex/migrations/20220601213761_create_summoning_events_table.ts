import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable("summoning_events", table => {
        table.string("transaction_hash", 100).notNullable();
        table.integer("block_number").unsigned().notNullable();
        table.boolean("removed").notNullable();
        table.string("address", 64).notNullable();
        table.integer("log_index").unsigned().notNullable();
        table.integer("transaction_index").unsigned().notNullable();
        table.string("owner", 64).notNullable();
        table.bigInteger("hero_id").unsigned().notNullable();
        table.bigInteger("summoner_id").unsigned().notNullable();
        table.bigInteger("assistant_id").unsigned().notNullable();
        table.string('stat_genes', 128).notNullable();
        table.string('visual_genes', 128).notNullable();
        table.integer("chain_id").unsigned().notNullable().references("chains.id");
        table.timestamps(true, true);

        table.primary(["chain_id", "transaction_hash", "log_index"]);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('summoning_events');
}

