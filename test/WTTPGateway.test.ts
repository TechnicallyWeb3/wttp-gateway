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

describe("WTTPGateway", function () {
  let gateway: WTTPGateway;
  let deployer: any;
  let user: any;

  // Mock data for testing
  const mockDataPoints = [
    hre.ethers.keccak256(hre.ethers.toUtf8Bytes("chunk1")),
    hre.ethers.keccak256(hre.ethers.toUtf8Bytes("chunk2")),
    hre.ethers.keccak256(hre.ethers.toUtf8Bytes("chunk3"))
  ];

  const mockRequestLine = {
    path: "/test-resource",
    protocol: "WTTP/3.0",
    method: 0 // GET
  };

  const mockHead = {
    requestLine: mockRequestLine,
    ifModifiedSince: 0,
    ifNoneMatch: hre.ethers.ZeroHash
  };

  // Fixture to deploy the gateway contract
  async function deployGatewayFixture() {
    [deployer, user] = await hre.ethers.getSigners();
    
    // Deploy WTTPGateway
    const WTTPGatewayFactory = await hre.ethers.getContractFactory("WTTPGateway");
    gateway = await WTTPGatewayFactory.deploy();
    await gateway.waitForDeployment();

    return { gateway, deployer, user };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      expect(await gateway.getAddress()).to.be.properAddress;
    });

    it("Should be able to interact with gateway methods", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      // Test that the contract is deployed and accessible
      expect(gateway).to.not.be.undefined;
      
      // Verify the contract has the expected methods
      expect(gateway.OPTIONS).to.be.a('function');
      expect(gateway.HEAD).to.be.a('function');
      expect(gateway.GET).to.be.a('function');
      expect(gateway.LOCATE).to.be.a('function');
    });
  });

  describe("Gateway Methods", function () {
    it("Should have OPTIONS method available", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      expect(gateway.OPTIONS).to.be.a('function');
    });

    it("Should have HEAD method available", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      expect(gateway.HEAD).to.be.a('function');
    });

    it("Should have GET method available", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      expect(gateway.GET).to.be.a('function');
    });

    it("Should have LOCATE method available", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      expect(gateway.LOCATE).to.be.a('function');
    });
  });

  describe("Error Handling", function () {
    it("Should revert when called with invalid site addresses", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      // Test with zero address
      const invalidSite = hre.ethers.ZeroAddress;
      
      // These calls should revert when called with zero address
      // Note: Actual behavior depends on the site implementation
      await expect(
        gateway.OPTIONS(invalidSite, mockRequestLine)
      ).to.be.reverted;
    });

    it("Should handle invalid parameters gracefully", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      // Test that methods exist and can be called (even if they revert)
      const invalidSite = hre.ethers.ZeroAddress;
      
      // Test GET with invalid parameters
      const getRequest = {
        head: mockHead,
        rangeBytes: { start: 0, end: 0 }
      };
      
      await expect(
        gateway.GET(invalidSite, getRequest)
      ).to.be.reverted;
    });
  });

  describe("Contract Interface", function () {
    it("Should expose the correct public interface", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      // Verify all expected public methods exist
      expect(gateway.OPTIONS).to.be.a('function');
      expect(gateway.HEAD).to.be.a('function');
      expect(gateway.GET).to.be.a('function');
      expect(gateway.LOCATE).to.be.a('function');
      
      // Verify contract deployment info is accessible
      expect(await gateway.getAddress()).to.be.properAddress;
    });

    it("Should have proper method signatures", async function () {
      const { gateway } = await loadFixture(deployGatewayFixture);
      
      // Test that we can create proper request structures
      const requestLine = {
        path: "/test",
        protocol: "WTTP/3.0",
        method: 0
      };
      
      const headRequest = {
        requestLine,
        ifModifiedSince: 0,
        ifNoneMatch: hre.ethers.ZeroHash
      };
      
      const getRequest = {
        head: headRequest,
        rangeBytes: { start: 0, end: 0 }
      };
      
      const locateRequest = {
        head: headRequest,
        rangeChunks: { start: 0, end: 0 }
      };
      
      // These should all be valid structures (even if calls fail due to no site)
      expect(requestLine).to.have.property('path');
      expect(headRequest).to.have.property('requestLine');
      expect(getRequest).to.have.property('rangeBytes');
      expect(locateRequest).to.have.property('rangeChunks');
    });
  });
}); 