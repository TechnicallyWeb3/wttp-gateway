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

// Import ethers from the hardhat runtime environment when running
// but allow direct import from ethers package when imported

import { ethers } from "hardhat";
import type { WTTPGateway } from "../typechain-types";
import { HEADResponseStructOutput } from "../typechain-types/@wttp/core/contracts/interfaces/IWTTPSite";
import { GETResponseStructOutput } from "../typechain-types/contracts/WTTPGateway";

/**
 * Fetches a resource from a WTTP site via the WTTPGateway
 * 
 * @param gateway - The WTTPGateway contract instance
 * @param site - The address of the WTTP site
 * @param path - The path to the resource
 * @param options - Optional parameters for the request
 * @returns The response from the gateway
 */
export async function fetchResource(
  gateway: WTTPGateway,
  site: string,
  path: string,
  options: {
    range?: { start: number, end: number },
    ifModifiedSince?: number,
    ifNoneMatch?: string,
    headRequest?: boolean
  } = {}
) {
  // Default options
  const { range, ifModifiedSince = 0, ifNoneMatch = ethers.ZeroHash, headRequest = false } = options;

  // Create the base request
  const requestLine = {
    path: path,
    protocol: "WTTP/3.0",
    method: headRequest ? 1 : 0 // HEAD = 1, GET = 0
  };

  // Create the head request
  const head = {
    requestLine,
    ifModifiedSince,
    ifNoneMatch
  };

  // If it's a HEAD request, just call HEAD
  if (headRequest) {
    console.log(`Sending HEAD request for ${path}`);
    return gateway.HEAD(site, { requestLine: head.requestLine, ifModifiedSince, ifNoneMatch });
  }
  // Otherwise, create a GET request
  const getRequest = {
    head,
    rangeBytes: range ? range: { start: 0, end: 0 }
  };

  console.log(`Fetching resource at ${path}${range ? ` with range ${range.start}-${range.end}` : ''}`);
  const response = await gateway.GET(site, getRequest);

  // Log the response status
  console.log(`Response status: ${response.head.responseLine.code}`);
  
  return response;
}

export function isText(mimeType: string): boolean {
  return mimeType === "0x7470" || // text/plain (tp)
    mimeType === "0x7468" || // text/html (th)
    mimeType === "0x7463" || // text/css (tc)
    mimeType === "0x746d" || // text/markdown (tm)
    mimeType === "0x616a" || // application/javascript (aj)
    mimeType === "0x616f" || // application/json (ao)
    mimeType === "0x6178" || // application/xml (ax)
    mimeType === "0x6973";   // image/svg+xml (is)
}

/**
 * Main function to fetch a resource
 */
export async function main(
  gateway: WTTPGateway,
  siteAddress: string,
  path: string,
  options: {
    range?: { start: number, end: number },
    ifModifiedSince?: number,
    ifNoneMatch?: string,
    headRequest?: boolean
  } = {}
) {
  
  // Fetch the resource
  const response = await fetchResource(gateway, siteAddress, path, options);
  let headData: HEADResponseStructOutput;
  // For GET requests, return the data as well
  let content: string | null = null;
  
  // If it's a HEAD request, just return the metadata
  if (options.headRequest) {
    headData = response as HEADResponseStructOutput;
    // return {
    //   status: response.responseLine.code,
    //   metadata: response.metadata,
    //   etag: response.etag
    // };
  } else {
    const getResponse = response as GETResponseStructOutput;
    headData = getResponse.head;
    if (headData.responseLine.code === 200n || headData.responseLine.code === 206n) {
        // Convert the response data to a string if it's text
      const mimeType = headData.metadata.mimeType;
        
      if (isText(mimeType)) {
        content = ethers.toUtf8String(getResponse.data);
      } else {
        content = `<Binary data: ${getResponse.data.length} bytes>`;
      }
    }
  }

  
  return {
    status: headData.responseLine.code,
    metadata: headData.metadata,
    etag: headData.etag,
    content,
    rawData: (response as GETResponseStructOutput).data || null
  };
}
