import cron from 'node-cron';
import pino from 'pino';
import httpApp from './http';

const logger = pino();

cron.schedule("* * * * *", () => {
    logger.info('Hi - I am running!');
});

const port = process.env.PORT || 4000;

httpApp.listen(port, () => {
    console.log(`Running the status server at http://localhost:${port}/`);
});
