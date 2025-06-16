/**
 * Copyright (C) 2025 TechnicallyWeb3
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 */

import { task } from "hardhat/config";
import { WTTPGateway } from "../typechain-types";
import { HEADRequestStruct, LOCATERequestStruct } from "@wttp/core";
import { GETRequestStruct } from "../typechain-types/contracts/WTTPGateway";

task("gateway:fetch", "Fetch a resource from a WTTP site via the WTTPGateway")
  .addParam("site", "The address of the WTTP site")
  .addParam("gateway", "The address of the WTTPGateway")
  .addOptionalParam("path", "The path to the resource", "/")
  .addOptionalParam("range", "Byte range in format 'start-end' (e.g., '10-20')")
  .addOptionalParam("ifModifiedSince", "Unix timestamp for If-Modified-Since header")
  .addOptionalParam("ifNoneMatch", "ETag value for If-None-Match header")
  .addFlag("head", "Perform a HEAD request instead of GET")
  .setAction(async (taskArgs, hre) => {
    const { site, gateway, path, range, ifModifiedSince, ifNoneMatch, head } = taskArgs;

    // Get the gateway contract instance
    const gatewayContract: WTTPGateway = await hre.ethers.getContractAt("WTTPGateway", gateway);
    
    // Parse range if provided
    let rangeOption = undefined;
    if (range) {
      const [start, end] = range.split("-").map((n: string) => parseInt(n.trim()));
      rangeOption = { start, end };
    }
    
    // Parse ifModifiedSince if provided
    const ifModifiedSinceOption = ifModifiedSince ? parseInt(ifModifiedSince) : 0;

    // Create the head request structure
    const headRequest: HEADRequestStruct = {
      path,
      ifModifiedSince: ifModifiedSinceOption,
      ifNoneMatch: ifNoneMatch || hre.ethers.ZeroHash
    };

    // If it's a HEAD request, just call HEAD
    if (head) {
      console.log(`\nSending HEAD request for ${path}`);
      const response = await gatewayContract.HEAD(site, headRequest);
      
      console.log("\n=== HEAD Response ===");
      console.log(`Status: ${response.status}`);
      console.log(`ETag: ${response.etag}`);
      console.log(`Last Modified: ${new Date(Number(response.metadata.lastModified) * 1000).toISOString()}`);
      console.log(`Size: ${response.metadata.size} bytes`);
      console.log(`Version: ${response.metadata.version}`);
      
      return response;
    }

    // Create the LOCATE request structure for GET
    const locateRequest: LOCATERequestStruct = {
      head: headRequest,
      rangeChunks: { start: 0, end: 0 }
    };

    // Create the GET request structure
    const getRequest: GETRequestStruct = {
      locate: locateRequest,
      rangeBytes: rangeOption || { start: 0, end: 0 }
    };

    console.log(`\nFetching resource at ${path}${range ? ` with range ${range}` : ''}`);
    const response = await gatewayContract.GET(site, getRequest);
    
    console.log("\n=== GET Response ===");
    console.log(`Status: ${response.head.status}`);
    console.log(`ETag: ${response.head.etag}`);
    console.log(`Last Modified: ${new Date(Number(response.head.metadata.lastModified) * 1000).toISOString()}`);
    console.log(`Size: ${response.head.metadata.size} bytes`);
    console.log(`Version: ${response.head.metadata.version}`);

    if (response.body.data.length > 0) {
      console.log("\n=== Content ===");
      try {
        // Try to decode as UTF-8 text
        const text = hre.ethers.toUtf8String(response.body.data);
        // If content is too large, truncate it
        const maxContentLength = 1000;
        if (text.length > maxContentLength) {
          console.log(`${text.substring(0, maxContentLength)}... (truncated, ${text.length} bytes total)`);
        } else {
          console.log(text);
        }
      } catch {
        // If not valid UTF-8, show as binary length
        console.log(`<Binary data: ${response.body.data.length} bytes>`);
      }
    }
    
    return response;
  });

export default {};