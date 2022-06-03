import schedule from 'node-schedule';
import pino from 'pino';
import httpApp from './http';
import { importNewEvents, importNewlySummonedHeroes } from './indexer';

const logger = pino();

run()
.then(() => { logger.info("Worker initialization complete."); })
.catch((e: any) => logger.error(e, "Worker initialization failed.") )

async function run() {
    startStatusServer();
    await importNewEvents();
    await importNewlySummonedHeroes();
    scheduleCronJobs();
}

function startStatusServer() {
    const port = process.env.PORT || 4000;

    httpApp.listen(port, () => {
        logger.info(`Running the status server at http://localhost:${port}/`);
    });
}


function scheduleCronJobs() {
    const everyFiveMinutes = "*/5 * * * *";
    schedule.scheduleJob(everyFiveMinutes, async () => {
        await importNewEvents();
        await importNewlySummonedHeroes();
    });
}

