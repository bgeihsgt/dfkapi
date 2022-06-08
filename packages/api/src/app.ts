import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import pinoHttp from 'pino-http';
import Schema from './schema'
import Resolvers from './resolvers';

const schema = buildSchema(`
    ${Schema.Hero}

    type Query {
        hero(id: ID!): Hero
    }
`);

const root = {
    hero: Resolvers.Hero
}

const app = express();
app.use(pinoHttp());
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
    customFormatErrorFn: err => ({
        message: err.message
    })
}));

export default app;