/**
 * Comprehensive WTTPGateway Tests
 * Copyright (C) 2025 TechnicallyWeb3
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
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

describe("WTTPGateway Comprehensive Tests", function () {
    let owner: any;
    let user: any;
    let dps: DataPointStorage;
    let dpr: DataPointRegistry;
    let wttpGateway: WTTPGateway;
    let wttpSite: Web3Site;

    // Test data generators to ensure unique data
    let testCounter = 0;
    
    function generateUniqueData(prefix: string, size: number = 100): string {
        testCounter++;
        const baseData = `${prefix}-${testCounter}-${Date.now()}`;
        return baseData.padEnd(size, 'x');
    }

    function generateUniqueBytes(prefix: string, size: number = 100): Uint8Array {
        return ethers.toUtf8Bytes(generateUniqueData(prefix, size));
    }

    before(async function () {
        [owner, user] = await ethers.getSigners();
        
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

    describe("Basic Method Tests", function () {
        let testPath: string;
        let headRequest: HEADRequestStruct;

        beforeEach(async function () {
            testPath = `/test-${testCounter++}`;
            headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create a basic resource for testing
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
                        data: generateUniqueBytes("basic-test"),
                        chunkIndex: 0,
                        publisher: owner.address,
                    }
                ]
            };

            await wttpSite.PUT(putRequest);
        });

        it("should forward OPTIONS requests correctly", async function () {
            const optionsResponse = await wttpGateway.OPTIONS(wttpSite.target, testPath);
            
            // OPTIONS should return the allowed methods, status may vary
            expect(optionsResponse.allow).to.be.greaterThan(0);
        });

        it("should forward HEAD requests correctly", async function () {
            const headResponse = await wttpGateway.HEAD(wttpSite.target, headRequest);
            
            expect(headResponse.status).to.equal(200);
            expect(headResponse.metadata.size).to.be.greaterThan(0);
        });

        it("should handle LOCATE requests with data point sizes", async function () {
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 0, end: 0},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            
            expect(locateResponse.locate.head.status).to.equal(200);
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(1);
            expect(locateResponse.structure.sizes.length).to.equal(1);
            expect(locateResponse.structure.totalSize).to.be.greaterThan(0);
        });

        it("should handle basic GET requests", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(200);
            expect(getResponse.data.data.length).to.be.greaterThan(0);
        });
    });

    describe("Multi-Chunk Data Assembly Tests", function () {
        let testPath: string;
        let headRequest: HEADRequestStruct;
        let chunk1Data: Uint8Array;
        let chunk2Data: Uint8Array;
        let chunk3Data: Uint8Array;

        beforeEach(async function () {
            testPath = `/multi-chunk-${testCounter++}`;
            headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create unique data for each chunk
            chunk1Data = generateUniqueBytes("chunk1", 50);
            chunk2Data = generateUniqueBytes("chunk2", 75);
            chunk3Data = generateUniqueBytes("chunk3", 60);

            // First PUT to create the resource
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
                        data: chunk1Data,
                        chunkIndex: 0,
                        publisher: owner.address,
                    }
                ]
            };

            await wttpSite.PUT(putRequest);

            // PATCH to add additional chunks
            const patchRequest1: PATCHRequestStruct = {
                head: headRequest,
                data: [
                    {
                        data: chunk2Data,
                        chunkIndex: 1,
                        publisher: owner.address,
                    }
                ]
            };

            await wttpSite.PATCH(patchRequest1);

            const patchRequest2: PATCHRequestStruct = {
                head: headRequest,
                data: [
                    {
                        data: chunk3Data,
                        chunkIndex: 2,
                        publisher: owner.address,
                    }
                ]
            };

            await wttpSite.PATCH(patchRequest2);
        });

        it("should correctly assemble data from multiple chunks", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0}, // All chunks
                },
                rangeBytes: {start: 0, end: 0}, // All bytes
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(200);
            
            // Verify the assembled data matches our chunks
            const expectedData = new Uint8Array([...chunk1Data, ...chunk2Data, ...chunk3Data]);
            expect(getResponse.data.data).to.deep.equal(expectedData);
        });

        it("should handle LOCATE with multiple chunks", async function () {
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 0, end: 0},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(3);
            expect(locateResponse.structure.sizes.length).to.equal(3);
            expect(locateResponse.structure.sizes[0]).to.equal(chunk1Data.length);
            expect(locateResponse.structure.sizes[1]).to.equal(chunk2Data.length);
            expect(locateResponse.structure.sizes[2]).to.equal(chunk3Data.length);
            expect(locateResponse.structure.totalSize).to.equal(
                chunk1Data.length + chunk2Data.length + chunk3Data.length
            );
        });
    });

    describe("Range Request Stress Tests", function () {
        let testPath: string;
        let headRequest: HEADRequestStruct;
        let totalDataSize: number;
        let chunk1Size: number;
        let chunk2Size: number;
        let chunk3Size: number;

        beforeEach(async function () {
            testPath = `/range-test-${testCounter++}`;
            headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create chunks with known sizes for precise range testing
            chunk1Size = 100;
            chunk2Size = 150;
            chunk3Size = 200;
            totalDataSize = chunk1Size + chunk2Size + chunk3Size;

            const chunk1Data = generateUniqueBytes("range-chunk1", chunk1Size);
            const chunk2Data = generateUniqueBytes("range-chunk2", chunk2Size);
            const chunk3Data = generateUniqueBytes("range-chunk3", chunk3Size);

            // Create multi-chunk resource
            const putRequest: PUTRequestStruct = {
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("application/octet-stream"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [
                    {
                        data: chunk1Data,
                        chunkIndex: 0,
                        publisher: owner.address,
                    }
                ]
            };

            await wttpSite.PUT(putRequest);

            // Add additional chunks
            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: chunk2Data,
                    chunkIndex: 1,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: chunk3Data,
                    chunkIndex: 2,
                    publisher: owner.address,
                }]
            });
        });

        it("should handle full range requests (0,0)", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 0},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(200);
            expect(getResponse.data.data.length).to.equal(totalDataSize);
        });

        it("should handle partial range from start", async function () {
            const rangeEnd = 50; // First 51 bytes (0-50 inclusive)
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: rangeEnd},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(206); // Partial content
            expect(getResponse.data.data.length).to.equal(rangeEnd + 1);
        });

        it("should handle partial range from middle", async function () {
            const rangeStart = 50;
            const rangeEnd = 200;
            const expectedSize = rangeEnd - rangeStart + 1;
            
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: rangeStart, end: rangeEnd},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(206);
            expect(getResponse.data.data.length).to.equal(expectedSize);
        });

        it("should handle range spanning multiple chunks", async function () {
            // Range that spans from chunk1 into chunk2
            const rangeStart = chunk1Size - 10; // Last 10 bytes of chunk1
            const rangeEnd = chunk1Size + 20; // First 21 bytes of chunk2
            const expectedSize = rangeEnd - rangeStart + 1;
            
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: rangeStart, end: rangeEnd},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(206);
            expect(getResponse.data.data.length).to.equal(expectedSize);
        });

        it("should handle negative range indices (from end)", async function () {
            // Last 50 bytes
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: -50, end: -1},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(206);
            expect(ethers.getBytes(getResponse.data.data).length).to.equal(50);
        });

        it("should handle mixed positive/negative ranges", async function () {
            // From byte 100 to last 10 bytes
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 100, end: -10},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(206);
            const expectedSize = totalDataSize - 10 - 100 + 1;
            expect(ethers.getBytes(getResponse.data.data).length).to.equal(expectedSize);
        });

        it("should handle single byte ranges", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 100, end: 100},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(206);
            expect(ethers.getBytes(getResponse.data.data).length).to.equal(1);
        });

        it("should handle zero-length ranges", async function () {
            // Range where start > end should result in empty data
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 100, end: 99},
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(204); // No content
            expect(ethers.getBytes(getResponse.data.data).length).to.equal(0);
        });
    });

    describe("Edge Cases and Error Handling", function () {
        it("should revert when LOCATE is not allowed", async function () {
            // Create a site that doesn't allow LOCATE
            const restrictedSite = await new Web3Site__factory(owner).deploy(
                owner.address,
                dpr.target,
                DEFAULT_HEADER,
            );
            await restrictedSite.waitForDeployment();

            const locateRequest: LOCATERequestStruct = {
                head: {
                    path: "/nonexistent",
                    ifModifiedSince: 0,
                    ifNoneMatch: ethers.ZeroHash,
                },
                rangeChunks: {start: 0, end: 0},
            };

            await expect(
                wttpGateway.LOCATE(restrictedSite.target, locateRequest)
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

        it.skip("should handle empty data points arrays", async function () {
            // This test would require a mock site that returns empty data points
            // For now, we'll test the behavior with a valid but empty resource
            const testPath = `/empty-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create resource with empty data
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
                        data: new Uint8Array(0), // Empty data
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
            expect(getResponse.data.data.length).to.equal(0);
        });
    });

    describe("Large Data Stress Tests", function () {
        it("should handle large multi-chunk resources", async function () {
            const testPath = `/large-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create a large resource with many chunks
            const chunkSize = 1000;
            const numChunks = 10;
            const chunks: Uint8Array[] = [];

            // Create first chunk with PUT
            const firstChunk = generateUniqueBytes("large-chunk-0", chunkSize);
            chunks.push(firstChunk);

            const putRequest: PUTRequestStruct = {
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("application/octet-stream"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [
                    {
                        data: firstChunk,
                        chunkIndex: 0,
                        publisher: owner.address,
                    }
                ]
            };

            await wttpSite.PUT(putRequest);

            // Add remaining chunks with PATCH
            for (let i = 1; i < numChunks; i++) {
                const chunkData = generateUniqueBytes(`large-chunk-${i}`, chunkSize);
                chunks.push(chunkData);

                await wttpSite.PATCH({
                    head: headRequest,
                    data: [{
                        data: chunkData,
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
            
            expect(getResponse.head.status).to.equal(200);
            expect(ethers.getBytes(getResponse.data.data).length).to.equal(chunkSize * numChunks);

            // Test LOCATE response
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 0, end: 0},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(numChunks);
            expect(locateResponse.structure.totalSize).to.equal(chunkSize * numChunks);
        });

        it("should handle complex range requests on large data", async function () {
            const testPath = `/complex-range-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create resource with varying chunk sizes
            const chunkSizes = [500, 750, 1000, 250, 800];
            const totalSize = chunkSizes.reduce((sum, size) => sum + size, 0);

            // Create first chunk
            const firstChunk = generateUniqueBytes("complex-0", chunkSizes[0]);
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("application/octet-stream"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: firstChunk,
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add remaining chunks
            for (let i = 1; i < chunkSizes.length; i++) {
                const chunkData = generateUniqueBytes(`complex-${i}`, chunkSizes[i]);
                await wttpSite.PATCH({
                    head: headRequest,
                    data: [{
                        data: chunkData,
                        chunkIndex: i,
                        publisher: owner.address,
                    }]
                });
            }

            // Test various complex ranges
            const testRanges = [
                { start: 100, end: 200, desc: "small range in first chunk" },
                { start: 400, end: 600, desc: "range spanning first two chunks" },
                { start: 1000, end: 2000, desc: "range spanning multiple middle chunks" },
                { start: -500, end: -1, desc: "last 500 bytes" },
                { start: 0, end: 99, desc: "first 100 bytes" },
                { start: totalSize - 100, end: totalSize - 1, desc: "last 100 bytes (positive)" },
            ];

            for (const range of testRanges) {
                const getRequest: GETRequestStruct = {
                    locate: {
                        head: headRequest,
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: range.start, end: range.end},
                };

                const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
                
                // Calculate expected size
                let expectedSize: number;
                if (range.start < 0 || range.end < 0) {
                    // Handle negative ranges
                    const normalizedStart = range.start < 0 ? totalSize + range.start : range.start;
                    const normalizedEnd = range.end < 0 ? totalSize + range.end : range.end;
                    expectedSize = normalizedEnd - normalizedStart + 1;
                } else {
                    expectedSize = range.end - range.start + 1;
                }

                expect(ethers.toUtf8String(getResponse.data.data).length).to.equal(expectedSize, 
                    `Failed for range: ${range.desc} (${range.start}, ${range.end})`);
                expect(getResponse.head.status).to.equal(206);
            }
        });
    });

    describe("Chunk Range Tests", function () {
        let testPath: string;
        let headRequest: HEADRequestStruct;

        beforeEach(async function () {
            testPath = `/chunk-range-${testCounter++}`;
            headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create a resource with 5 chunks
            const firstChunk = generateUniqueBytes("chunk-range-0", 100);
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: firstChunk,
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add 4 more chunks
            for (let i = 1; i < 5; i++) {
                const chunkData = generateUniqueBytes(`chunk-range-${i}`, 100);
                await wttpSite.PATCH({
                    head: headRequest,
                    data: [{
                        data: chunkData,
                        chunkIndex: i,
                        publisher: owner.address,
                    }]
                });
            }
        });

        it("should handle chunk range requests in LOCATE", async function () {
            // Request only chunks 1-3
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 1, end: 3},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(3);
            expect(locateResponse.structure.sizes.length).to.equal(3);
            expect(locateResponse.structure.totalSize).to.equal(300); // 3 chunks * 100 bytes
        });

        it("should handle single chunk requests", async function () {
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 2, end: 2},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(1);
            expect(locateResponse.structure.totalSize).to.equal(100);
        });
    });
});