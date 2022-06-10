import { Request, Response, NextFunction } from 'express';
import Router from 'express-promise-router';
import JSONAPISerializer from 'json-api-serializer';
import { NotFoundError } from '../customErrors';
import addHeroesRouter from './heroes';

const Serializer = new JSONAPISerializer();

const router = Router();

addHeroesRouter(router, Serializer);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        res.status(404);
    } else {
        res.status(500);
    }

    res.send(Serializer.serializeError(err));
})

export default router;