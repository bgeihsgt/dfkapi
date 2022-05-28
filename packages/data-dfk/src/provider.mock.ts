import { ethers, providers } from "ethers";
import talkback from "talkback";
import TalkbackServer from "talkback/server";
import Tape from "talkback/tape";
import { HARMONY_API_URL } from "./contracts/provider";
import path from 'path';

const SERENDALE_MOCK_PORT = 4100;

export function startSerendaleMockServer(suiteName: string, testName: string): TalkbackServer {
    const opts = {
        host: HARMONY_API_URL,
        record: process.env.TALKBACK_RECORD ? talkback.Options.RecordMode.NEW : talkback.Options.RecordMode.DISABLED,
        port: SERENDALE_MOCK_PORT,
        path: __dirname + "/tapes/serendale",
        tapeNameGenerator: (tapeNumber: number, tape: Tape) => {
            return path.join(suiteName, `${testName}-${tape.req.method}-${tapeNumber}`);
        },
    };
    const server = talkback(opts);
    server.start(() => { console.log("Mock server started"); });

    return server;
}

export function getSerendaleProvider(): providers.Provider {
    const provider = new ethers.providers.JsonRpcProvider(`http://localhost:${SERENDALE_MOCK_PORT}`);

    return provider;
}