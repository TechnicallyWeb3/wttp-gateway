/**
 * WTTPGateway Range and Stress Tests
 * Copyright (C) 2025 TechnicallyWeb3
 * 
 * Focused on LOCATE and GET range functionality and data assembly
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

describe("WTTPGateway Range and Stress Tests", function () {
    let owner: any;
    let dps: DataPointStorage;
    let dpr: DataPointRegistry;
    let wttpGateway: WTTPGateway;
    let wttpSite: Web3Site;

    // Test data generators with precise control
    let testCounter = 0;
    
    function generateExactBytes(content: string): Uint8Array {
        return ethers.toUtf8Bytes(content);
    }

    function generateUniqueContent(prefix: string, exactLength?: number): string {
        testCounter++;
        const baseContent = `${prefix}-${testCounter}`;
        if (exactLength) {
            if (baseContent.length >= exactLength) {
                return baseContent.substring(0, exactLength);
            }
            return baseContent.padEnd(exactLength, 'x');
        }
        return baseContent;
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

    describe("Multi-Chunk Data Assembly", function () {
        it("should correctly assemble data from multiple chunks", async function () {
            const testPath = `/multi-chunk-${testCounter++}`;
            const headRequest: HEADRequestStruct = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create chunks with exact known content
            const chunk1Content = "AAAAA"; // 5 bytes
            const chunk2Content = "BBBBB"; // 5 bytes
            const chunk3Content = "CCCCC"; // 5 bytes
            
            const chunk1Data = generateExactBytes(chunk1Content);
            const chunk2Data = generateExactBytes(chunk2Content);
            const chunk3Data = generateExactBytes(chunk3Content);

            // First PUT to create the resource
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: chunk1Data,
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // PATCH to add additional chunks
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

            // Test full data assembly
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0}, // All chunks
                },
                rangeBytes: {start: 0, end: 0}, // All bytes
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.head.status).to.equal(200);
            
            // Convert response data to string for comparison
            const assembledContent = ethers.toUtf8String(getResponse.data.data);
            const expectedContent = chunk1Content + chunk2Content + chunk3Content;
            
            expect(assembledContent).to.equal(expectedContent);
            expect(getResponse.data.data.length).to.equal(15); // 5 + 5 + 5
        });

        it("should handle LOCATE with data point size information", async function () {
            const testPath = `/locate-sizes-${testCounter++}`;
            const headRequest: HEADRequestStruct = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create chunks with different sizes
            const chunk1 = generateExactBytes("A".repeat(10)); // 10 bytes
            const chunk2 = generateExactBytes("B".repeat(20)); // 20 bytes
            const chunk3 = generateExactBytes("C".repeat(15)); // 15 bytes

            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: chunk1,
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: chunk2,
                    chunkIndex: 1,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: chunk3,
                    chunkIndex: 2,
                    publisher: owner.address,
                }]
            });

            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 0, end: 0},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(3);
            expect(locateResponse.structure.sizes.length).to.equal(3);
            expect(locateResponse.structure.sizes[0]).to.equal(10);
            expect(locateResponse.structure.sizes[1]).to.equal(20);
            expect(locateResponse.structure.sizes[2]).to.equal(15);
            expect(locateResponse.structure.totalSize).to.equal(45);
        });
    });

    describe("Range Request Tests", function () {
        let testPath: string;
        let headRequest: HEADRequestStruct;
        let fullContent: string;
        let totalSize: number;

        beforeEach(async function () {
            testPath = `/range-${testCounter++}`;
            headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create a resource with known pattern for easy testing
            const chunk1 = "0123456789"; // 10 bytes, positions 0-9
            const chunk2 = "ABCDEFGHIJ"; // 10 bytes, positions 10-19  
            const chunk3 = "abcdefghij"; // 10 bytes, positions 20-29
            fullContent = chunk1 + chunk2 + chunk3;
            totalSize = 30;

            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: generateExactBytes(chunk1),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: generateExactBytes(chunk2),
                    chunkIndex: 1,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: generateExactBytes(chunk3),
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
            expect(getResponse.data.data.length).to.equal(totalSize);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal(fullContent);
        });

        it("should handle partial range from start", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 0, end: 4}, // First 5 bytes: "01234"
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(5);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("01234");
        });

        it("should handle partial range from middle", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 5, end: 14}, // "56789ABCDE"
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(10);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("56789ABCDE");
        });

        it("should handle range spanning multiple chunks", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 8, end: 21}, // "89ABCDEFGHIJab"
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(14);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("89ABCDEFGHIJab");
        });

        it("should handle negative range indices (from end)", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: -5, end: -1}, // Last 5 bytes: "fghij"
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(5);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("fghij");
        });

        it("should handle mixed positive/negative ranges", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 25, end: -1}, // "efghij"
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(5);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("efghij");
        });

        it("should handle single byte ranges", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 15, end: 15}, // "F"
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(1);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("F");
        });

        it("should handle zero-length ranges", async function () {
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 0, end: 0},
                },
                rangeBytes: {start: 10, end: 9}, // Invalid range
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(0);
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

            // Create a resource with 5 chunks of 10 bytes each
            const chunks = ["0123456789", "ABCDEFGHIJ", "abcdefghij", "!@#$%^&*()", "0987654321"];
            
            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: generateExactBytes(chunks[0]),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            for (let i = 1; i < chunks.length; i++) {
                await wttpSite.PATCH({
                    head: headRequest,
                    data: [{
                        data: generateExactBytes(chunks[i]),
                        chunkIndex: i,
                        publisher: owner.address,
                    }]
                });
            }
        });

        it("should handle chunk range requests in LOCATE", async function () {
            // Request only chunks 1-3 (ABCDEFGHIJ, abcdefghij, !@#$%^&*())
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 1, end: 3},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(3);
            expect(locateResponse.structure.sizes.length).to.equal(3);
            expect(locateResponse.structure.totalSize).to.equal(30); // 3 chunks * 10 bytes
        });

        it("should handle single chunk requests", async function () {
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 2, end: 2}, // Just the "abcdefghij" chunk
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(1);
            expect(locateResponse.structure.totalSize).to.equal(10);
        });

        it("should handle GET with chunk ranges", async function () {
            // Get chunks 1-2 with byte range within those chunks
            const getRequest: GETRequestStruct = {
                locate: {
                    head: headRequest,
                    rangeChunks: {start: 1, end: 2}, // ABCDEFGHIJ + abcdefghij
                },
                rangeBytes: {start: 5, end: 14}, // "FGHIJabcde"
            };

            const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
            
            expect(getResponse.data.data.length).to.equal(10);
            expect(ethers.toUtf8String(getResponse.data.data)).to.equal("FGHIJabcde");
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
            const chunkSize = 100;
            const numChunks = 20;
            let totalExpectedSize = 0;

            // Create first chunk with PUT
            const firstChunk = generateUniqueContent("chunk-0", chunkSize);
            totalExpectedSize += firstChunk.length;

            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("application/octet-stream"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: generateExactBytes(firstChunk),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Add remaining chunks with PATCH
            for (let i = 1; i < numChunks; i++) {
                const chunkContent = generateUniqueContent(`chunk-${i}`, chunkSize);
                totalExpectedSize += chunkContent.length;

                await wttpSite.PATCH({
                    head: headRequest,
                    data: [{
                        data: generateExactBytes(chunkContent),
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
            expect(getResponse.data.data.length).to.equal(totalExpectedSize);

            // Test LOCATE response
            const locateRequest: LOCATERequestStruct = {
                head: headRequest,
                rangeChunks: {start: 0, end: 0},
            };

            const locateResponse = await wttpGateway.LOCATE(wttpSite.target, locateRequest);
            expect(locateResponse.locate.resource.dataPoints.length).to.equal(numChunks);
            expect(locateResponse.structure.totalSize).to.equal(totalExpectedSize);
        });
    });

    describe("Data Integrity Tests", function () {
        it("should preserve data integrity across range requests", async function () {
            const testPath = `/integrity-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create a resource with known pattern
            const pattern = "0123456789";
            const repeats = 10; // 100 bytes total
            const fullContent = pattern.repeat(repeats);

            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: generateExactBytes(fullContent),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            // Test various ranges and verify data integrity
            const ranges = [
                { start: 0, end: 9, expected: "0123456789" },    // First pattern
                { start: 10, end: 19, expected: "0123456789" },  // Second pattern
                { start: 5, end: 14, expected: "5678901234" },   // Overlapping pattern
                { start: 50, end: 59, expected: "0123456789" },  // Middle section
                { start: 90, end: 99, expected: "0123456789" },  // End section
            ];

            for (const range of ranges) {
                const getRequest: GETRequestStruct = {
                    locate: {
                        head: headRequest,
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: range.start, end: range.end},
                };

                const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
                const retrievedData = ethers.toUtf8String(getResponse.data.data);
                
                expect(retrievedData).to.equal(range.expected, 
                    `Data mismatch for range ${range.start}-${range.end}`);
            }
        });

        it("should handle boundary conditions correctly", async function () {
            const testPath = `/boundary-${testCounter++}`;
            const headRequest = {
                path: testPath,
                ifModifiedSince: 0,
                ifNoneMatch: ethers.ZeroHash,
            };

            // Create multi-chunk resource with exact boundaries
            const chunk1 = "AAAAA"; // 5 bytes
            const chunk2 = "BBBBB"; // 5 bytes  
            const chunk3 = "CCCCC"; // 5 bytes
            // Total: 15 bytes, boundaries at 5, 10

            await wttpSite.PUT({
                head: headRequest,
                properties: {
                    mimeType: encodeMimeType("text/plain"),
                    charset: encodeCharset("utf-8"),
                    encoding: encodeEncoding("identity"),
                    language: encodeLanguage("en"),
                },
                data: [{
                    data: generateExactBytes(chunk1),
                    chunkIndex: 0,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: generateExactBytes(chunk2),
                    chunkIndex: 1,
                    publisher: owner.address,
                }]
            });

            await wttpSite.PATCH({
                head: headRequest,
                data: [{
                    data: generateExactBytes(chunk3),
                    chunkIndex: 2,
                    publisher: owner.address,
                }]
            });

            // Test boundary conditions
            const boundaryTests = [
                { start: 0, end: 4, expected: "AAAAA" },     // Exact first chunk
                { start: 5, end: 9, expected: "BBBBB" },     // Exact second chunk
                { start: 10, end: 14, expected: "CCCCC" },   // Exact third chunk
                { start: 4, end: 5, expected: "AB" },        // Boundary between 1st and 2nd
                { start: 9, end: 10, expected: "BC" },       // Boundary between 2nd and 3rd
                { start: 2, end: 7, expected: "AAABBB" },    // Spanning chunks 1-2
                { start: 7, end: 12, expected: "BBBCCC" },   // Spanning chunks 2-3
                { start: 2, end: 12, expected: "AAABBBCCC" }, // Spanning all chunks
            ];

            for (const test of boundaryTests) {
                const getRequest: GETRequestStruct = {
                    locate: {
                        head: headRequest,
                        rangeChunks: {start: 0, end: 0},
                    },
                    rangeBytes: {start: test.start, end: test.end},
                };

                const getResponse = await wttpGateway.GET(wttpSite.target, getRequest);
                const retrievedData = ethers.toUtf8String(getResponse.data.data);
                
                expect(retrievedData).to.equal(test.expected, 
                    `Boundary test failed for range ${test.start}-${test.end}`);
            }
        });
    });
});