import { Router as ExpressRouter } from 'express';
import Router from 'express-promise-router';
import Resolvers from '../resolvers';
import JSONAPISerializer from 'json-api-serializer';
import { getById } from './makeRoute';

export default function(router: ExpressRouter, serializer: JSONAPISerializer) {
    const type = "heroes";
    serializer.register(type);

    const heroesRouter = Router();

    getById(type, heroesRouter, serializer, req => Resolvers.Hero({ id: req.params.id }));

    router.use(`/${type}`, heroesRouter);
};