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
import { HEADRequestStruct, LOCATERequestStruct, loadContract } from "@wttp/core";
import { GETRequestStruct } from "../typechain-types/contracts/WTTPGateway";

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
    chunkRange?: { start: number, end: number },
    byteRange?: { start: number, end: number },
    ifModifiedSince?: number,
    ifNoneMatch?: string,
    headRequest?: boolean
  } = {}
) {
  // Default options
  const { 
    chunkRange, 
    byteRange, 
    ifModifiedSince = 0, 
    ifNoneMatch = ethers.ZeroHash, 
    headRequest = false 
  } = options;

  // Create the head request structure
  const headRequest_: HEADRequestStruct = {
    path,
    ifModifiedSince,
    ifNoneMatch
  };

  // If it's a HEAD request, just call HEAD
  if (headRequest) {
    console.log(`Sending HEAD request for ${path}`);
    return gateway.HEAD(site, headRequest_);
  }

  // Create the LOCATE request structure for GET
  const locateRequest: LOCATERequestStruct = {
    head: headRequest_,
    rangeChunks: chunkRange ? chunkRange : { start: 0, end: 0 }
  };

  // Create the GET request structure
  const getRequest: GETRequestStruct = {
    locate: locateRequest,
    rangeBytes: byteRange ? byteRange : { start: 0, end: 0 }
  };

  console.log(`Fetching resource at ${path}${byteRange ? ` with range ${byteRange.start}-${byteRange.end}` : ''}`);
  const response = await gateway.GET(site, getRequest);

  // Log the response status
  console.log(`Response status: ${response.head.status}`);
  
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
  
  // Process the response
  if (options.headRequest ) {
    // For HEAD requests, return the metadata
    return {
      status: response.status,
      metadata: response.metadata,
      etag: response.etag,
      content: null,
      rawData: null
    };
  } else {
    // For GET requests, process the data
    const getResponse = response;
    const status = getResponse.head.status;
    const metadata = getResponse.head.metadata;
    let content: string | null = null;

    if (status === 200n || status === 206n) {
      if (isText(metadata.mimeType)) {
        content = ethers.toUtf8String(getResponse.body.data);
      } else {
        content = `<Binary data: ${ethers.getBytes(getResponse.body.data).length} bytes>`;
      }
    }

    return {
      status,
      metadata,
      etag: getResponse.head.etag,
      content,
      rawData: getResponse.body.data
    };
  }
}
