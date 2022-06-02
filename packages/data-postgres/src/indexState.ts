import knex from './knex';

import { Optional } from 'typescript-optional';

export interface IndexState {
    chainId: number,
    name: string,
    blockNumber: number
};

export async function upsertIndexState(state: IndexState) {
    await knex("index_state")
            .insert({
                chain_id: state.chainId,
                name: state.name,
                block_number: state.blockNumber,
                updated_at: new Date().toUTCString()
            })
            .onConflict(["chain_id", "name"])
            .merge();
}

export async function getIndexState(chainId: number, name: string): Promise<Optional<IndexState>> {
    const retrieved = await knex("index_state")
                            .select(["chain_id", "name", "block_number"])
                            .where({ chain_id: chainId, name: name });

    if (retrieved.length === 0) {
        return Optional.empty();
    }

    return Optional.of({
        chainId: retrieved[0].chain_id,
        name: retrieved[0].name,
        blockNumber: retrieved[0].block_number
    });
}