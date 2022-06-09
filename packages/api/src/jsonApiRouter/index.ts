import Router from 'express-promise-router';
import Resolvers from '../resolvers';
import JSONAPISerializer from 'json-api-serializer';

const Serializer = new JSONAPISerializer();

Serializer.register('heroes');

const router = Router();

const heroesRouter = Router();

heroesRouter.get("/:id", async (req, res) => {
    const hero = await Resolvers.Hero({ id: req.params.id });

    res.send(await Serializer.serializeAsync('heroes', hero));
    res.status(200);
});

router.use('/heroes', heroesRouter);

export default router;