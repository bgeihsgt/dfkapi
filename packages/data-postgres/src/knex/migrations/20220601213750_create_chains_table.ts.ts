import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("chains", table => {
        table.integer("id").unsigned().primary();
        table.string("chain_name", 50).notNullable();
        table.string("kingdom_name", 50).notNullable();
    });

    await knex("chains").insert([
        { id: 0, chain_name: "Harmony", kingdom_name: "Serendale" },
        { id: 1, chain_name: "DFK Chain", kingdom_name: "Crystalvale" }
    ]);
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('chains');
}

