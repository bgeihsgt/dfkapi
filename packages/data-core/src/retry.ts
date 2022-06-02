const RETRY_DELAY_SECONDS = process.env.NODE_ENV === "test" ? 100 : 2 * 1000; // Stopgap until a more robust config system is in place.


function delay(millis: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), millis);
    });
}

export async function retry<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
    try {
        console.log("Attempting inside retry");
        return await fn();
    }
    catch (e) {
        if (maxRetries > 0) {
            console.log("retrying because of error: ", e);
            await delay(RETRY_DELAY_SECONDS);
            return await retry(fn, maxRetries - 1);
        } else {
            throw e;
        }
    }
}