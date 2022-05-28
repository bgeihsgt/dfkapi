import { ethers } from "ethers";
import talkback from "talkback";
import TalkbackServer from "talkback/server";
import Tape from "talkback/tape";
import { HARMONY_API_URL, DFK_CHAIN_API_HOST, Provider, ProviderLocation } from "./contracts/provider";
import path from 'path';

const SERENDALE_MOCK_PORT = 4100;
const CRYSTALVALE_MOCK_PORT = 4200;

function startMockServer(suiteName: string, testName: string, host: string, port: number, tapeDirName: string) {
    const opts = {
        host,
        record: process.env.TALKBACK_RECORD ? talkback.Options.RecordMode.NEW : talkback.Options.RecordMode.DISABLED,
        port,
        path: __dirname + "/tapes/" + tapeDirName,
        tapeNameGenerator: (tapeNumber: number, tape: Tape) => {
            return path.join(suiteName, `${testName}-${tape.req.method}-${tapeNumber}`);
        }
    };
    const server = talkback(opts);
    server.start(() => { console.log("Mock server started"); });

    return server;
}

function getProvider(port: number, path: string, location: ProviderLocation): Provider {
    return {
        provider: new ethers.providers.JsonRpcProvider(`http://localhost:${port}/${path}`),
        location
    };
}

export function startSerendaleMockServer(suiteName: string, testName: string): TalkbackServer {
    return startMockServer(suiteName, testName, HARMONY_API_URL, SERENDALE_MOCK_PORT, "serendale");
}

export function getSerendaleProvider(): Provider {
    return getProvider(SERENDALE_MOCK_PORT, "", ProviderLocation.Serendale);
}

export function startCrystalvaleMockServer(suiteName: string, testName: string): TalkbackServer {
    return startMockServer(suiteName, testName, DFK_CHAIN_API_HOST, CRYSTALVALE_MOCK_PORT, "crystalvale");
}

export function getCrystalvaleProvider(): Provider {
    return getProvider(CRYSTALVALE_MOCK_PORT, "defi-kingdoms/dfk-chain/rpc", ProviderLocation.Crystalvale);
}