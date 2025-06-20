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

task("gateway:fetch", "Fetch a resource from a WTTP site via the WTTPGateway")
  .addParam("site", "The address of the WTTP site")
  .addOptionalParam("gateway", "The address of the WTTPGateway", "")
  .addOptionalParam("path", "The path to the resource", "/")
  .addOptionalParam("range", "Byte range in format 'start-end' (e.g., '10-20')")
  .addOptionalParam("ifModifiedSince", "Unix timestamp for If-Modified-Since header")
  .addOptionalParam("ifNoneMatch", "ETag value for If-None-Match header")
  .addFlag("head", "Perform a HEAD request instead of GET")
  .setAction(async (taskArgs, hre) => {

    

    const { fetchResource, isText } = require("../scripts/fetchResource");
    const { bytes2ToMimeType } = require("../scripts/uploadFile");
    const { wttp, site, path, range, ifModifiedSince, ifNoneMatch, head } = taskArgs;

    const gateway: WTTPGateway = await hre.ethers.getContractAt("WTTPGateway", wttp);
    
    // Parse range if provided
    let rangeOption = undefined;
    if (range) {
      const [start, end] = range.split("-").map((n: string) => parseInt(n.trim()));
      rangeOption = { start, end };
    }
    
    // Parse ifModifiedSince if provided
    const ifModifiedSinceOption = ifModifiedSince ? parseInt(ifModifiedSince) : undefined;    
    // Fetch the resource
    const response = await fetchResource(
      gateway,
      site,
      path,
      {
        range: rangeOption,
        ifModifiedSince: ifModifiedSinceOption,
        ifNoneMatch,
        headRequest: head
      }
    );

    console.log("\n=== WTTP Response ===");
    let headData = undefined;
    let mimeType = undefined;
    if (head) {
      headData = response;
      mimeType = headData.metadata.mimeType;
      console.log("\n=== HEAD Response ==="); 
    } else {
      headData = response.head;
      mimeType = headData.metadata.mimeType;
      console.log("\n=== GET Response ===");
      console.log("\n=== Content ===");
      if (isText(mimeType)) {
        console.log(`Data: ${hre.ethers.toUtf8String(response.data)}`);
      } else {
        console.log(`Data: ${response.data.length - 2} bytes`); // remove the 0x prefix
      }
      console.log("================\n");
    }

    console.log(`ETag: ${headData.etag}`);
    console.log(`Last Modified: ${new Date(Number(headData.metadata.lastModified) * 1000).toISOString()}`);
    console.log(`Content-Type: ${bytes2ToMimeType(mimeType)}`);
    console.log(`Charset: ${headData.metadata.charset}`);
    console.log(`Encoding: ${headData.metadata.encoding}`);
    console.log(`Language: ${headData.metadata.language}`);
    console.log(`Size: ${headData.metadata.size} bytes`);
    console.log(`Version: ${headData.metadata.version}`);
    
    if (response.content) {
      console.log("\n=== Content ===");
      // If content is too large, truncate it
      const maxContentLength = 1000;
      if (response.content.length > maxContentLength) {
        console.log(`${response.content.substring(0, maxContentLength)}... (truncated, ${response.content.length} bytes total)`);
      } else {
        console.log(response.content);
      }
    }
    
    return response;
  });

export default {};