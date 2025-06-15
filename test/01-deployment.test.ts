import { expect } from "chai";
import { ethers } from "hardhat";
import { 
    type DataPointStorage, 
    DataPointStorage__factory, 
    type DataPointRegistry, 
    DataPointRegistry__factory 
} from "@tw3/esp";

import { type Web3Site, Web3Site__factory } from "@wttp/site";
import { 
    DEFAULT_HEADER, 
    PUTRequestStruct, 
    HEADRequestStruct, 
    encodeMimeType,
    encodeCharset,
    encodeEncoding,
    encodeLanguage,
    LOCATERequestStruct,
} from "@wttp/core";
import { type WTTPGateway, WTTPGateway__factory } from "../typechain-types";
import { GETRequestStruct } from "../typechain-types/contracts/WTTPGateway";

describe("Deploy ESP Contracts", function () {
    let owner: any;
    let dps: DataPointStorage;
    let dpr: DataPointRegistry;
    let wttpGateway: WTTPGateway;
    let wttpSite: Web3Site;
    let headRequest: HEADRequestStruct;
    let locateRequest: LOCATERequestStruct;
    let getRequest: GETRequestStruct;

    before(async function () {
        [owner] = await ethers.getSigners();
        
        dps = await new DataPointStorage__factory(owner).deploy();
        await dps.waitForDeployment();
        await expect(dps.VERSION).to.not.be.reverted;

        dpr = await new DataPointRegistry__factory(owner).deploy(
            owner.address, 
            dps.target,
            ethers.parseUnits('0.001', 'gwei')
        );
        await dpr.waitForDeployment();
        expect(await dpr.DPS()).to.equal(dps.target);


        wttpGateway = await new WTTPGateway__factory(owner).deploy();
        await wttpGateway.waitForDeployment();

    });

    beforeEach(async function () {
        wttpSite = await new Web3Site__factory(owner).deploy(
            owner.address,
            dpr.target,
            DEFAULT_HEADER,
        );
        await wttpSite.waitForDeployment();
        expect(await wttpSite.DPR()).to.equal(dpr.target);

        headRequest = {
            path: "/",
            ifModifiedSince: 0,
            ifNoneMatch: ethers.ZeroHash,
        };

        const putRequest: PUTRequestStruct = {
            head: headRequest,
            properties: {
                mimeType: encodeMimeType("text/plain"),
                charset: encodeCharset("utf-8"),
                encoding: encodeEncoding("identity"),
                language: encodeLanguage("en"),
            },
            data: [
                {
                    data: ethers.toUtf8Bytes("Hello, World!"),
                    chunkIndex: 0,
                    publisher: owner.address,
                }
            ]
        }


        await wttpSite.PUT(putRequest);

        locateRequest = {
            head: headRequest,
            rangeChunks: {start: 0, end: 0},
        };

        getRequest = {
            locate: locateRequest,
            rangeBytes: {start: 0, end: 0},
        };

        const getResponse = await wttpSite.GET(locateRequest);

        expect(getResponse.head.status).to.equal(200);
        expect(getResponse.resource.dataPoints.length).to.equal(1);
    });

    it("should GET via WTTPGateway", async function () {

        const response = await wttpGateway.GET(wttpSite.target, getRequest);
        expect(response.head.status).to.equal(200);
        expect(ethers.toUtf8String(response.body.data)).to.equal("Hello, World!");
    });
});