/**
 * WTTPGateway Edge Cases and Error Handling Tests
 * Copyright (C) 2025 TechnicallyWeb3
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

describe("WTTPGateway Edge Cases and Error Handling", function () {
    let owner: any;
    let dps: DataPointStorage;
    let dpr: DataPointRegistry;
    let wttpGateway: WTTPGateway;
    let wttpSite: Web3Site;

    let testCounter = 0;

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
    });

    beforeEach(async function () {
        // Deploy a fresh site for each test
        wttpSite = await new Web3Site__factory(owner).deploy(
            owner.address,
            dpr.target,
            DEFAULT_HEADER,
        );
        await wttpSite.waitForDeployment();
    });

    describe("Error Conditions", function () {
        it("should revert when LOCATE is not allowed for nonexistent resource", async function () {
            const locateRequest: LOCATERequestStruct = {
                head: {
                    path: "/nonexistent",
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 0, end: 0},
            };

            await expect(
                wttpGateway.LOCATE(wttpSite.target, locateRequest)
            ).to.be.reverted;
        });

        it("should handle requests for nonexistent resources", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: {
                        path: "/nonexistent",
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            await expect(
                wttpGateway.GET(wttpSite.target, getRequest)
            ).to.be.reverted;
        });

        it("should handle invalid site addresses", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: {
                        path: "/test",
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            await expect(
                wttpGateway.GET(ethers.ZeroAddress, getRequest)
            ).to.be.reverted;
        });
    });

    describe("Edge Cases", function () {
        it("should handle very small data chunks", async function () {
            const testPath = `/small-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create resource with very small data
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
                        data: ethers.toUtf8Bytes("a"), // Single character
                        chunkIndex: 0,
                        publisher: owner.address,
                    }
                ]
            };

            await wttpSite.PUT(putRequest);

            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            expect(getResponse.data.data.length).to.equal(1);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("a");
        });

        it("should handle single character resources", async function () {
            const testPath = `/single-char-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: ethers.toUtf8Bytes("X"),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Test various range requests on single character
            const testCases = [
                { start: 0, end: 0, expected: "X", desc: "full range" },
                { start: 0, end: 0, expected: "X", desc: "exact range" },
                { start: -1, end: -1, expected: "X", desc: "negative range" },
            ];

            for (const testCase of testCases) {
                const getRequest: GETRequestStruct = {
                    locate: {
                        head: headRequest,
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: testCase.start, end: testCase.end},
                };

                const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
                expect(ethers.toUtf8String(getResponse.data.data)).to.equal(testCase.expected, 
                    `Failed for ${testCase.desc}`);
            }
        });

        it("should handle out-of-bounds range requests gracefully", async function () {
            const testPath = `/bounds-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create a 10-byte resource
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: ethers.toUtf8Bytes("0123456789"), // 10 bytes
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Test out-of-bounds ranges - these should revert
            const outOfBoundsRanges = [
                { start: 15, end: 20, desc: "completely out of bounds" },
                { start: 5, end: 15, desc: "end out of bounds" },
                { start: -15, end: -10, desc: "negative out of bounds" },
            ];

            for (const range of outOfBoundsRanges) {
                const getRequest: GETRequestStruct = {
                    locate: {
                        head: headRequest,
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: range.start, end: range.end},
                };

                await expect(
                    wttpGateway.GET(wttpSite.target, getRequest),
                    `Should revert for ${range.desc}`
                ).to.be.reverted;
            }
        });

        it("should handle empty ranges correctly", async function () {
            const testPath = `/empty-range-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: ethers.toUtf8Bytes("Hello World"),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Test ranges that result in empty data
            const emptyRanges = [
                { start: 5, end: 4, desc: "start > end" },
                { start: 10, end: 9, desc: "start > end at end" },
            ];

            for (const range of emptyRanges) {
                const getRequest: GETRequestStruct = {
                    locate: {
                        head: headRequest,
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: range.start, end: range.end},
                };

                const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
                expect(getResponse.data.data.length).to.equal(0, 
                    `Should return empty data for ${range.desc}`);
            }
        });
    });

    describe("Special Characters and Encoding", function () {
        it("should handle special characters correctly", async function () {
            const testPath = `/special-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            const specialContent = "Hello 🌍 World! @#$%^&*()";
            
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: ethers.toUtf8Bytes(specialContent),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            const retrievedContent = ethers.toUtf8String(getResponse.data.data);
            
            expect(retrievedContent).to.equal(specialContent);
        });

        it("should handle binary data correctly", async function () {
            const testPath = `/binary-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create binary data
            const binaryData = new Uint8Array([0, 1, 2, 3, 255, 254, 253, 128, 127]);
            
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("application/octet-stream"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: binaryData,
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(binaryData.length);
            expect(getResponse.data.data).to.deep.equal(binaryData);
        });
    });

    describe("Performance Edge Cases", function () {
        it("should handle many small chunks efficiently", async function () {
            const testPath = `/many-small-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            const numChunks = 50;
            const chunkSize = 2; // Very small chunks
            let expectedContent = "";

            // Create first chunk
            const firstChunk = "A".repeat(chunkSize);
            expectedContent += firstChunk;
            
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: ethers.toUtf8Bytes(firstChunk),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add many small chunks
            for (let i = 1; i < numChunks; i++) {
                const chunkContent = String.fromCharCode(65 + (i % 26)).repeat(chunkSize); // A, B, C, etc.
                expectedContent += chunkContent;
                
                await wttpSite.PATCH({
                    head: headRequest,
                    data: [{
                        data: ethers.toUtf8Bytes(chunkContent),
                        chunkIndex: i,
                        publisher: owner.address,
                    }]
                });
            }

            // Test full retrieval
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(numChunks * chunkSize);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal(expectedContent);

            // Test LOCATE
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 0, end: 0},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(numChunks);
            expect(locateResponse.structure.totalSize).to.equal(numChunks * chunkSize);
        });
    });
});