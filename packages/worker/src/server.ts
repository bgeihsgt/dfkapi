import cron from 'node-cron';
import pino from 'pino';
import httpApp from './http';
import dataDfk from '@dfkapi/data-dfk';
import dataPostgres from '@dfkapi/data-postgres';

const logger = pino();

run()
.then(() => { logger.info("Worker initialization complete."); })
.catch((e: any) => logger.error(e, "Worker initialization failed.") )

async function run() {
    startStatusServer();
    await importEvents();
    scheduleCronJobs();
}

async function importEvents() {
    const SERENDALE_CHAIN_ID = 0;
    const provider = dataDfk.getSerendaleProvider();
    const startingBlock = 0;
    const latestBlock = await provider.provider.getBlockNumber();
    const blockRanges = dataDfk.splitBlockRanges(startingBlock, latestBlock, 100_000);

    for (const blockRange of blockRanges) {
        logger.info(`Retrieving hero summoned events for blocks ${blockRange.from} to ${blockRange.to}`);
        const heroSummonedEvents = await dataDfk.getHeroSummonedEvents(blockRange.from, blockRange.to, dataDfk.getSerendaleProvider);
        logger.info(`Upserting ${heroSummonedEvents.length} for blocks ${blockRange.from} to ${blockRange.to}`);
        await dataPostgres.upsertSummoningEvents(heroSummonedEvents, SERENDALE_CHAIN_ID);
    }
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

