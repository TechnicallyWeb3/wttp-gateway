/**
 * Corrected WTTPGateway Tests
 * Copyright (C) 2025 TechnicallyWeb3
 * 
 * Tests that properly handle the hex string response format
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
    PATCHRequestStruct,
} from "@wttp/core";
import { type WTTPGateway, WTTPGateway__factory } from "../typechain-types";
import { GETRequestStruct } from "../typechain-types/contracts/WTTPGateway";

describe("WTTPGateway Corrected Tests", function () {
    let owner: any;
    let dps: DataPointStorage;
    let dpr: DataPointRegistry;
    let wttpGateway: WTTPGateway;
    let wttpSite: Web3Site;

    let testCounter = 0;

    // Helper function to get actual byte length from hex string
    function getActualByteLength(hexData: string): number {
        if (hexData === "0x") return 0;
        return (hexData.length - 2) / 2; // Remove "0x" and divide by 2
    }

    // Helper function to convert hex data to Uint8Array for comparison
    function hexToBytes(hexData: string): Uint8Array {
        if (hexData === "0x") return new Uint8Array(0);
        return ethers.getBytes(hexData);
    }

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

    describe("Basic Gateway Functionality", function () {
        it("should handle simple single-chunk GET", async function () {
            const testPath = `/simple-${testCounter++}`;
            const content = "Hello World";
            
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
                    data: ethers.toUtf8Bytes(content),
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

            expect(getResponse.head.status).to.equal(200);
            expect(getActualByteLength(getResponse.data.data)).to.equal(content.length);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal(content);
        });

        it("should handle LOCATE requests", async function () {
            const testPath = `/locate-${testCounter++}`;
            const content = "Test Content";
            
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
                    data: ethers.toUtf8Bytes(content),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Test LOCATE through gateway
            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, {
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 0, end: 0},
            });

            expect(locateResponse.locate.head.status).to.equal(200);
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(1);
            expect(locateResponse.structure.sizes.length).to.equal(1);
            expect(Number(locateResponse.structure.sizes[0])).to.equal(content.length);
            expect(Number(locateResponse.structure.totalSize)).to.equal(content.length);
        });
    });

    describe("Multi-Chunk Data Assembly", function () {
        it("should assemble data from two chunks", async function () {
            const testPath = `/two-chunks-${testCounter++}`;
            const chunk1 = "AAAAA"; // 5 bytes
            const chunk2 = "BBBBB"; // 5 bytes
            
            // Create first chunk
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
                    data: ethers.toUtf8Bytes(chunk1),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add second chunk
            await wttpSite.PATCH({
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                data: [{
                    data: ethers.toUtf8Bytes(chunk2),
                    chunkIndex: 1,
                    publisher: owner.address,
                }]
            });

            // Test full assembly
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

            expect(getResponse.head.status).to.equal(200);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal(chunk1 + chunk2);
            expect(getActualByteLength(getResponse.data.data)).to.equal(10);
        });

        it("should handle LOCATE with multiple chunks", async function () {
            const testPath = `/multi-locate-${testCounter++}`;
            const chunks = ["AAA", "BBB", "CCC"]; // 3 bytes each
            
            // Create first chunk
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
                    data: ethers.toUtf8Bytes(chunks[0]),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add remaining chunks
            for (let i = 1; i < chunks.length; i++) {
                await wttpSite.PATCH({
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    data: [{
                        data: ethers.toUtf8Bytes(chunks[i]),
                        chunkIndex: i,
                        publisher: owner.address,
                    }]
                });
            }

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, {
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 0, end: 0},
            });

            expect(locateResponse.locate.resource.dataPoints.length).to.equal(3);
            expect(locateResponse.structure.sizes.length).to.equal(3);
            expect(Number(locateResponse.structure.sizes[0])).to.equal(3);
            expect(Number(locateResponse.structure.sizes[1])).to.equal(3);
            expect(Number(locateResponse.structure.sizes[2])).to.equal(3);
            expect(Number(locateResponse.structure.totalSize)).to.equal(9);
        });
    });

    describe("Range Request Tests", function () {
        it("should handle simple byte ranges", async function () {
            const testPath = `/range-${testCounter++}`;
            const content = "0123456789"; // 10 bytes
            
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

            // Test first 5 bytes
            const getResponse1 = await wttpGateway.GET(wttpSite.target, {
                locate: {
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 4}, // "01234"
            });

            expect(getActualByteLength(getResponse1.data.data)).to.equal(5);
            expect(ethers.toUtf8String(getResponse1.data.data)).to.equal("01234");

            // Test middle bytes
            const getResponse2 = await wttpGateway.GET(wttpSite.target, {
                locate: {
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 3, end: 6}, // "3456"
            });

            expect(getActualByteLength(getResponse2.data.data)).to.equal(4);
            expect(ethers.toUtf8String(getResponse2.data.data)).to.equal("3456");

            // Test last bytes
            const getResponse3 = await wttpGateway.GET(wttpSite.target, {
                locate: {
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 7, end: 9}, // "789"
            });

            expect(getActualByteLength(getResponse3.data.data)).to.equal(3);
            expect(ethers.toUtf8String(getResponse3.data.data)).to.equal("789");
        });

        it("should handle ranges across multiple chunks", async function () {
            const testPath = `/cross-range-${testCounter++}`;
            const chunk1 = "AAAAA"; // 5 bytes, positions 0-4
            const chunk2 = "BBBBB"; // 5 bytes, positions 5-9
            
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
                    data: ethers.toUtf8Bytes(chunk1),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                data: [{
                    data: ethers.toUtf8Bytes(chunk2),
                    chunkIndex: 1,
                    publisher: owner.address,
                }]
            });

            // Test range spanning both chunks
            const getResponse = await wttpGateway.GET(wttpSite.target, {
                locate: {
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 3, end: 6}, // "AABB"
            });

            expect(getActualByteLength(getResponse.data.data)).to.equal(4);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("AABB");
        });

        it("should handle negative ranges", async function () {
            const testPath = `/negative-${testCounter++}`;
            const content = "0123456789"; // 10 bytes
            
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

            // Test last 3 bytes using negative indices
            const getResponse = await wttpGateway.GET(wttpSite.target, {
                locate: {
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: -3, end: -1}, // "789"
            });

            expect(getActualByteLength(getResponse.data.data)).to.equal(3);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("789");
        });
    });

    describe("Chunk Range Tests", function () {
        it("should handle chunk range in LOCATE", async function () {
            const testPath = `/chunk-range-${testCounter++}`;
            const chunks = ["AAA", "BBB", "CCC", "DDD"]; // 4 chunks of 3 bytes each
            
            // Create first chunk
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
                    data: ethers.toUtf8Bytes(chunks[0]),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add remaining chunks
            for (let i = 1; i < chunks.length; i++) {
                await wttpSite.PATCH({
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    data: [{
                        data: ethers.toUtf8Bytes(chunks[i]),
                        chunkIndex: i,
                        publisher: owner.address,
                    }]
                });
            }

            // Request only chunks 1-2 (BBB, CCC)
            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, {
                head: {
                    path: testPath,
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 1, end: 2},
            });

            expect(locateResponse.locate.resource.dataPoints.length).to.equal(2);
            expect(locateResponse.structure.sizes.length).to.equal(2);
            expect(Number(locateResponse.structure.totalSize)).to.equal(6); // 2 chunks * 3 bytes
        });

        it("should handle GET with chunk ranges", async function () {
            const testPath = `/chunk-get-${testCounter++}`;
            const chunks = ["AAA", "BBB", "CCC"]; // 3 chunks of 3 bytes each
            
            // Create first chunk
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
                    data: ethers.toUtf8Bytes(chunks[0]),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add remaining chunks
            for (let i = 1; i < chunks.length; i++) {
                await wttpSite.PATCH({
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    data: [{
                        data: ethers.toUtf8Bytes(chunks[i]),
                        chunkIndex: i,
                        publisher: owner.address,
                    }]
                });
            }

            // Get chunks 1-2 with byte range within those chunks
            const getResponse = await wttpGateway.GET(wttpSite.target, {
                locate: {
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 1, end: 2}, // BBB + CCC
                },
                rangeBytes: {start: 1, end: 4}, // "BCCC"
            });

            expect(getActualByteLength(getResponse.data.data)).to.equal(4);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("BCCC");
        });
    });

    describe("Error Handling", function () {
        it("should revert for nonexistent resources", async function () {
            await expect(
                wttpGateway.GET(wttpSite.target, {
                    locate: {
                        head: {
                            path: "/nonexistent",
                            ifModifiedSince: 0,
                            ifNoneMatch: ethers.ZeroHash,
                        },
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: 0, end: 0},
                })
            ).to.be.reverted;
        });

        it("should handle empty ranges", async function () {
            const testPath = `/empty-range-${testCounter++}`;
            const content = "Hello";
            
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

            // Range where start > end should return empty
            const getResponse = await wttpGateway.GET(wttpSite.target, {
                locate: {
                    head: {
                        path: testPath,
                        ifModifiedSince: 0,
                        ifNoneMatch: ethers.ZeroHash,
                    },
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 3, end: 2}, // Invalid range
            });

            expect(getActualByteLength(getResponse.data.data)).to.equal(0);
        });

        it("should handle out-of-bounds ranges", async function () {
            const testPath = `/bounds-${testCounter++}`;
            const content = "Hello"; // 5 bytes
            
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

            // Test out-of-bounds range - should revert
            await expect(
                wttpGateway.GET(wttpSite.target, {
                    locate: {
                        head: {
                            path: testPath,
                            ifModifiedSince: 0,
                            ifNoneMatch: ethers.ZeroHash,
                        },
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: 0, end: 10}, // end > content length
                })
            ).to.be.reverted;
        });
    });

    describe("Data Integrity Tests", function () {
        it("should preserve data integrity across complex ranges", async function () {
            const testPath = `/integrity-${testCounter++}`;
            const content = "0123456789ABCDEFGHIJ"; // 20 bytes
            
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

            // Test various ranges
            const testCases = [
                { start: 0, end: 4, expected: "01234" },
                { start: 5, end: 9, expected: "56789" },
                { start: 10, end: 14, expected: "ABCDE" },
                { start: 15, end: 19, expected: "FGHIJ" },
                { start: 2, end: 7, expected: "234567" },
                { start: 8, end: 12, expected: "89ABC" },
            ];

            for (const testCase of testCases) {
                const getResponse = await wttpGateway.GET(wttpSite.target, {
                    locate: {
                        head: {
                            path: testPath,
                            ifModifiedSince: 0,
                            ifNoneMatch: ethers.ZeroHash,
                        },
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: testCase.start, end: testCase.end},
                });

                const retrievedData = ethers.toUtf8String(getResponse.data.data);
                expect(retrievedData).to.equal(testCase.expected, 
                    `Failed for range ${testCase.start}-${testCase.end}`);
                expect(getActualByteLength(getResponse.data.data)).to.equal(testCase.expected.length);
            }
        });
    });
});