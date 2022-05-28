import knex from 'knex';
import config from './knex/knexfile';

const runtimeConfig = getRuntimeConfig();

function getRuntimeConfig() {
    switch (process.env.NODE_ENV) {
        case "production":
            return config.production;
        case "test":
            return config.test;
        default:
            return config.development;
    }
}

export default knex(getRuntimeConfig());