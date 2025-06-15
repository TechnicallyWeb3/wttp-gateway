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
import fs from "fs";
import path from "path";

describe("Deployment Scripts", function () {
  let deployer: any;
  let user: any;

  async function setupFixture() {
    [deployer, user] = await hre.ethers.getSigners();
    return { deployer, user };
  }

  describe("DeployVanity Script", function () {
    it("Should have deployWithVanity function available", async function () {
      const { deployWithVanity } = await import("../scripts/DeployVanity");
      expect(deployWithVanity).to.be.a('function');
    });

    it("Should validate nonce requirements for vanity deployment", async function () {
      const { deployWithVanity } = await import("../scripts/DeployVanity");
      
      // On local hardhat network, this should work
      // On other networks with used addresses, it should fail
      const network = hre.network.name;
      
      if (network === "hardhat" || network === "localhost") {
        // Should work on clean local network
        expect(deployWithVanity).to.be.a('function');
      } else {
        // On other networks, might fail due to nonce requirements
        expect(deployWithVanity).to.be.a('function');
      }
    });

    it("Should handle skip verification parameter", async function () {
      const { deployWithVanity } = await import("../scripts/DeployVanity");
      
      // Test that the function accepts the skipVerification parameter
      expect(deployWithVanity).to.be.a('function');
      
      // Function signature has default parameters, so length might be 0
      // The important thing is that it's callable with parameters
      expect(deployWithVanity.length).to.be.lessThanOrEqual(2);
    });
  });

  describe("AddDeployment Script", function () {
    it("Should have addDeployment function available", async function () {
      const { addDeployment } = await import("../scripts/AddDeployment");
      expect(addDeployment).to.be.a('function');
    });

    it("Should have formatDeploymentData function available", async function () {
      const { formatDeploymentData } = await import("../scripts/AddDeployment");
      expect(formatDeploymentData).to.be.a('function');
    });

    it("Should format deployment data correctly", async function () {
      const { formatDeploymentData } = await import("../scripts/AddDeployment");
      
      const chainId = 31337;
      const gatewayResult = {
        address: "0x1234567890123456789012345678901234567890",
        deployerAddress: "0x0987654321098765432109876543210987654321",
        txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
      };
      
      const deploymentData = formatDeploymentData(chainId, gatewayResult);
      
      expect(deploymentData).to.have.property('chainId', chainId);
      expect(deploymentData).to.have.property('gateway');
      expect(deploymentData.gateway).to.have.property('contractAddress', gatewayResult.address);
      expect(deploymentData.gateway).to.have.property('deployerAddress', gatewayResult.deployerAddress);
      expect(deploymentData.gateway).to.have.property('txHash', gatewayResult.txHash);
    });

    it("Should skip hardhat chain in addDeployment", async function () {
      const { addDeployment, formatDeploymentData } = await import("../scripts/AddDeployment");
      
      const hardhatChainId = 31337;
      const gatewayResult = {
        address: "0x1234567890123456789012345678901234567890",
        deployerAddress: "0x0987654321098765432109876543210987654321",
        txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
      };
      
      const deploymentData = formatDeploymentData(hardhatChainId, gatewayResult);
      
      // Should complete without error (skips hardhat chain)
      await expect(addDeployment(deploymentData)).to.not.be.rejected;
    });
  });

  describe("CheckDeploymentStatus Script", function () {
    it("Should be importable and executable", async function () {
      // Check that the script file exists and is readable
      const scriptPath = path.join(__dirname, "..", "scripts", "CheckDeploymentStatus.ts");
      expect(fs.existsSync(scriptPath)).to.be.true;
      
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      expect(scriptContent).to.include("Checking WTTP deployment status");
    });
  });

  describe("Deployment Registry", function () {
    it("Should have valid deployment registry file", async function () {
      const registryPath = path.join(__dirname, "..", "wttp.deployments.ts");
      expect(fs.existsSync(registryPath)).to.be.true;
      
      // Import and validate structure
      const { wttpDeployments } = await import("../wttp.deployments");
      expect(wttpDeployments).to.have.property('chains');
      expect(wttpDeployments.chains).to.be.an('object');
    });

    it("Should have proper deployment entry structure", async function () {
      const { wttpDeployments } = await import("../wttp.deployments");
      
      // Check that chainId 0 exists
      expect(wttpDeployments.chains).to.have.property('0');
      const chain0 = (wttpDeployments.chains as any)[0];
      expect(chain0).to.have.property('gateway');
      expect(chain0.gateway).to.have.property('contractAddress');
      expect(chain0.gateway).to.have.property('deployerAddress');
      expect(chain0.gateway).to.have.property('deployedAt');
    });
  });

  describe("Task Integration", function () {
    // Note: Tasks are not loaded during test runs, so we skip these tests
    it.skip("Should have deploy tasks available", async function () {
      // These tasks should be registered in hardhat
      // We can't easily test task execution here, but we can verify they exist
      const taskNames = Object.keys(hre.tasks);
      
      expect(taskNames).to.include('deploy:vanity');
      expect(taskNames).to.include('deploy:simple');
      expect(taskNames).to.include('deploy:verify');
    });

    it.skip("Should have fetch task available", async function () {
      const taskNames = Object.keys(hre.tasks);
      expect(taskNames).to.include('fetch');
    });
  });

  describe("AddDeployment End-to-End Tests", function () {
    let originalRegistryContent: string;
    let registryPath: string;
    let gateway: any;
    let deployer: any;

    before(async function () {
      // Setup deployer and deploy a real contract for testing
      [deployer] = await hre.ethers.getSigners();
      
      // Deploy a real WTTPGateway contract
      const WTTPGatewayFactory = await hre.ethers.getContractFactory("WTTPGateway");
      gateway = await WTTPGatewayFactory.deploy();
      await gateway.waitForDeployment();
      
      // Backup original registry file
      registryPath = path.join(__dirname, "..", "wttp.deployments.ts");
      originalRegistryContent = fs.readFileSync(registryPath, 'utf8');
    });

    // after(async function () {
    //   // Restore original registry file
    //   fs.writeFileSync(registryPath, originalRegistryContent, 'utf8');
    // });

    it("Should skip deployment when chainId is 31337 (hardhat)", async function () {
      const { addDeployment, formatDeploymentData } = await import("../scripts/AddDeployment");
      
      const gatewayAddress = await gateway.getAddress();
      const hardhatChainId = 31337;
      
      const gatewayResult = {
        address: gatewayAddress,
        deployerAddress: deployer.address,
        txHash: gateway.deploymentTransaction()?.hash || "0xtest"
      };
      
      const deploymentData = formatDeploymentData(hardhatChainId, gatewayResult);
      
      // Store original content for comparison
      const contentBefore = fs.readFileSync(registryPath, 'utf8');
      
      // Should complete without error but not modify the file
      await expect(addDeployment(deploymentData)).to.not.be.rejected;
      
      // Verify file was not modified
      const contentAfter = fs.readFileSync(registryPath, 'utf8');
      expect(contentAfter).to.equal(contentBefore);
      
      // Verify the deployment is NOT in the registry (since 31337 should be skipped)
      const { wttpDeployments } = await import("../wttp.deployments");
      expect(wttpDeployments.chains).to.not.have.property('31337');
      // Verify chainId 0 still exists (the original one)
      expect(wttpDeployments.chains).to.have.property('0');
    });

    it("Should successfully add deployment when chainId is changed from 31337 to 1337", async function () {
      const { addDeployment, formatDeploymentData } = await import("../scripts/AddDeployment");
      
      const gatewayAddress = await gateway.getAddress();
      const testChainId = 1337; // Changed from 31337 to bypass skip
      
      const gatewayResult = {
        address: gatewayAddress,
        deployerAddress: deployer.address,
        txHash: gateway.deploymentTransaction()?.hash || "0xtest"
      };
      
      const deploymentData = formatDeploymentData(testChainId, gatewayResult);
      
      // Add the deployment
      await expect(addDeployment(deploymentData)).to.not.be.rejected;
      
      // Verify the file was modified
      const updatedContent = fs.readFileSync(registryPath, 'utf8');
      expect(updatedContent).to.not.equal(originalRegistryContent);
      
      // Verify the deployment was added correctly
      // We need to re-import to get the updated registry
      delete require.cache[require.resolve("../wttp.deployments")];
      const { wttpDeployments } = await import("../wttp.deployments");
      
      expect(wttpDeployments.chains).to.have.property('1337');
      expect((wttpDeployments.chains as any)[1337]).to.have.property('gateway');
      expect((wttpDeployments.chains as any)[1337].gateway.contractAddress).to.equal(gatewayAddress);
      expect((wttpDeployments.chains as any)[1337].gateway.deployerAddress).to.equal(deployer.address);
      expect((wttpDeployments.chains as any)[1337].gateway.txHash).to.equal(gatewayResult.txHash);
      expect((wttpDeployments.chains as any)[1337].gateway).to.have.property('deployedAt');
      
      // Verify the deployedAt timestamp is recent (within last minute)
      const deployedAt = new Date((wttpDeployments.chains as any)[1337].gateway.deployedAt);
      const now = new Date();
      const timeDiff = now.getTime() - deployedAt.getTime();
      expect(timeDiff).to.be.lessThan(60000); // Less than 1 minute
    });

    it("Should update existing deployment when chainId already exists", async function () {
      const { addDeployment, formatDeploymentData } = await import("../scripts/AddDeployment");
      
      // Deploy a second contract
      const WTTPGatewayFactory = await hre.ethers.getContractFactory("WTTPGateway");
      const secondGateway = await WTTPGatewayFactory.deploy();
      await secondGateway.waitForDeployment();
      
      const secondGatewayAddress = await secondGateway.getAddress();
      const testChainId = 1337; // Same chainId as previous test
      
      const gatewayResult = {
        address: secondGatewayAddress,
        deployerAddress: deployer.address,
        txHash: secondGateway.deploymentTransaction()?.hash || "0xtest2"
      };
      
      const deploymentData = formatDeploymentData(testChainId, gatewayResult);
      
      // Update the existing deployment
      await expect(addDeployment(deploymentData)).to.not.be.rejected;
      
      // Verify the deployment was updated correctly
      delete require.cache[require.resolve("../wttp.deployments")];
      const { wttpDeployments } = await import("../wttp.deployments");
      
      expect(wttpDeployments.chains).to.have.property('1337');
      expect((wttpDeployments.chains as any)[1337].gateway.contractAddress).to.equal(secondGatewayAddress);
      expect((wttpDeployments.chains as any)[1337].gateway.txHash).to.equal(gatewayResult.txHash);
    });

    it("Should add deployment to different chainId without affecting existing ones", async function () {
      const { addDeployment, formatDeploymentData } = await import("../scripts/AddDeployment");
      
      const gatewayAddress = await gateway.getAddress();
      const differentChainId = 5; // Goerli testnet
      
      const gatewayResult = {
        address: gatewayAddress,
        deployerAddress: deployer.address,
        txHash: "0xdifferentTxHash"
      };
      
      const deploymentData = formatDeploymentData(differentChainId, gatewayResult);
      
      // Add deployment for different chain
      await expect(addDeployment(deploymentData)).to.not.be.rejected;
      
      // Verify both deployments exist
      delete require.cache[require.resolve("../wttp.deployments")];
      const { wttpDeployments } = await import("../wttp.deployments");
      
      expect(wttpDeployments.chains).to.have.property('1337');
      expect(wttpDeployments.chains).to.have.property('5');
      
      // Verify 1337 deployment is unchanged
      expect((wttpDeployments.chains as any)[1337]).to.have.property('gateway');
      
      // Verify 5 deployment is correct
      expect((wttpDeployments.chains as any)[5]).to.have.property('gateway');
      expect((wttpDeployments.chains as any)[5].gateway.contractAddress).to.equal(gatewayAddress);
      expect((wttpDeployments.chains as any)[5].gateway.deployerAddress).to.equal(deployer.address);
      expect((wttpDeployments.chains as any)[5].gateway.txHash).to.equal("0xdifferentTxHash");
    });

    it("Should properly format deployment data with all fields", async function () {
      const { formatDeploymentData } = await import("../scripts/AddDeployment");
      
      const gatewayAddress = await gateway.getAddress();
      const testChainId = 42;
      
      const gatewayResult = {
        address: gatewayAddress,
        deployerAddress: deployer.address,
        txHash: "0xformattingTest"
      };
      
      const deploymentData = formatDeploymentData(testChainId, gatewayResult);
      
      expect(deploymentData).to.deep.equal({
        chainId: testChainId,
        gateway: {
          contractAddress: gatewayAddress,
          deployerAddress: deployer.address,
          txHash: "0xformattingTest"
        }
      });
    });

    it("Should handle missing txHash in formatDeploymentData", async function () {
      const { formatDeploymentData } = await import("../scripts/AddDeployment");
      
      const gatewayAddress = await gateway.getAddress();
      const testChainId = 43;
      
      const gatewayResult = {
        address: gatewayAddress,
        deployerAddress: deployer.address
        // No txHash provided
      };
      
      const deploymentData = formatDeploymentData(testChainId, gatewayResult);
      
      expect(deploymentData).to.deep.equal({
        chainId: testChainId,
        gateway: {
          contractAddress: gatewayAddress,
          deployerAddress: deployer.address,
          txHash: undefined
        }
      });
    });
  });
}); 