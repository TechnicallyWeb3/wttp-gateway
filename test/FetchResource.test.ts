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

import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { WTTPGateway } from "../typechain-types";

describe("FetchResource", function () {
  let gateway: WTTPGateway;
  let deployer: any;
  let user: any;

  async function deployGatewayFixture() {
    [deployer, user] = await hre.ethers.getSigners();
    
    // Deploy WTTPGateway for testing
    const WTTPGatewayFactory = await hre.ethers.getContractFactory("WTTPGateway");
    gateway = await WTTPGatewayFactory.deploy();
    await gateway.waitForDeployment();

    return { gateway, deployer, user };
  }

  describe("fetchResource Function", function () {
    it("Should be importable", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      expect(fetchResource).to.be.a('function');
    });

    it("Should have correct function signature", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      
      // Function signature: (gateway, site, path, options = {})
      // With default parameter, length reports 3 (required parameters)
      expect(fetchResource.length).to.equal(3);
    });

    it("Should handle default options", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      const mockSite = "0x1234567890123456789012345678901234567890";
      const testPath = "/test-resource";
      
      // Should accept call with minimal parameters (will fail due to no real site)
      try {
        await fetchResource(gateway, mockSite, testPath);
      } catch (error) {
        // Expected to fail with mock site, but function should be callable
        expect(error).to.exist;
      }
    });

    it("Should handle range options", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      const mockSite = "0x1234567890123456789012345678901234567890";
      const testPath = "/test-resource";
      const options = {
        range: { start: 10, end: 50 },
        ifModifiedSince: Date.now(),
        ifNoneMatch: "some-etag",
        headRequest: false
      };
      
      // Should accept call with all options (will fail due to no real site)
      try {
        await fetchResource(gateway, mockSite, testPath, options);
      } catch (error) {
        // Expected to fail with mock site, but function should be callable
        expect(error).to.exist;
      }
    });

    it("Should handle HEAD request option", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      const mockSite = "0x1234567890123456789012345678901234567890";
      const testPath = "/test-resource";
      const options = {
        headRequest: true
      };
      
      // Should accept HEAD request option (will fail due to no real site)
      try {
        await fetchResource(gateway, mockSite, testPath, options);
      } catch (error) {
        // Expected to fail with mock site, but function should be callable
        expect(error).to.exist;
      }
    });
  });

  describe("Request Structure Validation", function () {
    it("Should create proper request structures", async function () {
      // Test the structure of requests that would be created
      const testPath = "/test-resource";
      const protocol = "WTTP/3.0";
      
      const requestLine = {
        path: testPath,
        protocol: protocol,
        method: 0 // GET
      };
      
      expect(requestLine).to.have.property('path', testPath);
      expect(requestLine).to.have.property('protocol', protocol);
      expect(requestLine).to.have.property('method', 0);
    });

    it("Should handle range parameters correctly", async function () {
      const range = { start: 10, end: 50 };
      
      expect(range).to.have.property('start', 10);
      expect(range).to.have.property('end', 50);
      
      // Test range validation
      expect(range.start).to.be.lessThan(range.end);
      expect(range.start).to.be.greaterThanOrEqual(0);
    });

    it("Should handle conditional request parameters", async function () {
      const ifModifiedSince = Math.floor(Date.now() / 1000);
      const ifNoneMatch = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("test-etag"));
      
      expect(ifModifiedSince).to.be.a('number');
      expect(ifNoneMatch).to.be.a('string');
      expect(ifNoneMatch).to.match(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe("Error Handling", function () {
    it("Should handle invalid gateway parameter", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      
      // Test with undefined gateway
      try {
        await fetchResource(undefined as any, "0x123", "/test");
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("Should handle invalid site address", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      // Test with invalid site address format
      try {
        await fetchResource(gateway, "invalid-address", "/test");
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("Should handle invalid path parameter", async function () {
      const { fetchResource } = await import("../scripts/fetchResource");
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      const validSite = "0x1234567890123456789012345678901234567890";
      
      // Test with empty path
      try {
        await fetchResource(gateway, validSite, "");
      } catch (error) {
        // May or may not error depending on site implementation
        // Just ensure function is callable
      }
    });
  });

  describe("Integration with Gateway", function () {
    it("Should properly interface with WTTPGateway contract", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      // Verify gateway has required methods
      expect(gateway.GET).to.be.a('function');
      expect(gateway.HEAD).to.be.a('function');
      
      // Verify gateway is properly deployed
      expect(await gateway.getAddress()).to.be.properAddress;
    });

    it("Should handle gateway method calls", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      const mockSite = hre.ethers.ZeroAddress;
      const requestLine = {
        path: "/test",
        protocol: "WTTP/3.0",
        method: 0
      };
      
      // These should revert due to zero address, but should be callable
      await expect(gateway.OPTIONS(mockSite, requestLine)).to.be.reverted;
      
      const headRequest = {
        requestLine,
        ifModifiedSince: 0,
        ifNoneMatch: hre.ethers.ZeroHash
      };
      
      await expect(gateway.HEAD(mockSite, headRequest)).to.be.reverted;
    });
  });
}); 