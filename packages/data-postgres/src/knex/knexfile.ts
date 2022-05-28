const baseConfig = {
    client: 'pg',
    migrations: {
        directory: __dirname + '/migrations'
    },
    seeds: {
        directory: __dirname + '/seeds'
    }
};

const config = {
    development: {
        ...baseConfig,
        connection: 'postgres://localhost/dfkcommunityapi'
    },
    test: {
        ...baseConfig,
        connection: 'postgres://localhost/dfkcommunityapi_test'
    },
    production: {
        ...baseConfig,
        connection: process.env.DATABASE_URL,
    }
}

export default config;