import cron from 'node-cron';
import pino from 'pino';
import httpApp from './http';
import dataDfk from '@dfkapi/data-dfk';
import dataPostgres from '@dfkapi/data-postgres';
import { importNewEvents, refreshAllHeroes } from './indexer';

const logger = pino();

run()
.then(() => { logger.info("Worker initialization complete."); })
.catch((e: any) => logger.error(e, "Worker initialization failed.") )

async function run() {
    startStatusServer();
    await importNewEvents();
    await refreshAllHeroes();
    scheduleCronJobs();
}

function startStatusServer() {
    const port = process.env.PORT || 4000;

    httpApp.listen(port, () => {
        logger.info(`Running the status server at http://localhost:${port}/`);
    });
}


function scheduleCronJobs() {
    cron.schedule("* * * * *", () => {
        logger.info('Hi - I am running!');
    });
}

