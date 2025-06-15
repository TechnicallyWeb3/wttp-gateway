/**
 * Debug Tests for WTTPGateway
 */

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
    encodeMimeType,
    encodeCharset,
    encodeEncoding,
    encodeLanguage,
} from "@wttp/core";
import { type WTTPGateway, WTTPGateway__factory } from "../typechain-types";

describe("WTTPGateway Debug Tests", function () {
    let owner: any;
    let dps: DataPointStorage;
    let dpr: DataPointRegistry;
    let wttpGateway: WTTPGateway;
    let wttpSite: Web3Site;

    before(async function () {
        [owner] = await ethers.getSigners();
        
        // Deploy ESP contracts
        dps = await new DataPointStorage__factory(owner).deploy();
        await dps.waitForDeployment();
        
        dpr = await new DataPointRegistry__factory(owner).deploy(
            owner.address, 
            dps.target,
            ethers.parseUnits('0.001', 'gwei')
        );
        await dpr.waitForDeployment();

        // Deploy WTTPGateway
        wttpGateway = await new WTTPGateway__factory(owner).deploy();
        await wttpGateway.waitForDeployment();

        // Deploy site
        wttpSite = await new Web3Site__factory(owner).deploy(
            owner.address,
            dpr.target,
            DEFAULT_HEADER,
        );
        await wttpSite.waitForDeployment();
    });

    it("should debug data lengths", async function () {
        const testPath = "/debug";
        const content = "AAAAA"; // Exactly 5 bytes
        const contentBytes = ethers.toUtf8Bytes(content);
        
        console.log("Original content:", content);
        console.log("Original content length:", content.length);
        console.log("Content bytes:", contentBytes);
        console.log("Content bytes length:", contentBytes.length);
        
        // Create resource
        await wttpSite.PUT({
            head: {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            },
            properties: {
                mimeType: encodeMimeType("text/plain"),
                charset: encodeCharset("utf-8"),
                encoding: encodeEncoding("identity"),
                language: encodeLanguage("en"),
            },
            data: [{
                data: contentBytes,
                chunkIndex: 0,
                publisher: owner.address,
            }]
        });

        // Test GET through gateway
        const getResponse = await wttpGateway.GET(wttpSite.target, {
            locate: {
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 0, end: 0},
            },
            rangeBytes: {start: 0, end: 0},
        });

        console.log("Response data:", getResponse.data.data);
        console.log("Response data length:", getResponse.data.data.length);
        console.log("Response data as hex:", ethers.hexlify(getResponse.data.data));
        console.log("Response data as string:", ethers.toUtf8String(getResponse.data.data));
        
        // Test LOCATE
        const locateResponse = await wttpGateway.LOCATE(wttpSite.target, {
            head: {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            },
            rangeChunks: {start: 0, end: 0},
        });

        console.log("LOCATE sizes:", locateResponse.structure.sizes);
        console.log("LOCATE total size:", locateResponse.structure.totalSize);
    });

    it("should debug range requests", async function () {
        const testPath = "/debug-range";
        const content = "0123456789"; // Exactly 10 bytes
        
        await wttpSite.PUT({
            head: {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            },
            properties: {
                mimeType: encodeMimeType("text/plain"),
                charset: encodeCharset("utf-8"),
                encoding: encodeEncoding("identity"),
                language: encodeLanguage("en"),
            },
            data: [{
                data: ethers.toUtf8Bytes(content),
                chunkIndex: 0,
                publisher: owner.address,
            }]
        });

        // Test range 0-4 (should be "01234")
        const getResponse = await wttpGateway.GET(wttpSite.target, {
            locate: {
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 0, end: 0},
            },
            rangeBytes: {start: 0, end: 4},
        });

        console.log("Range 0-4 response data:", getResponse.data.data);
        console.log("Range 0-4 response length:", getResponse.data.data.length);
        console.log("Range 0-4 as string:", ethers.toUtf8String(getResponse.data.data));
        
        // Test empty range
        const emptyResponse = await wttpGateway.GET(wttpSite.target, {
            locate: {
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 0, end: 0},
            },
            rangeBytes: {start: 5, end: 4}, // start > end
        });

        console.log("Empty range response data:", emptyResponse.data.data);
        console.log("Empty range response length:", emptyResponse.data.data.length);
    });
});