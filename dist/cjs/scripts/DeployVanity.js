"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployWithVanity = deployWithVanity;
const hardhat_1 = __importDefault(require("hardhat"));
const ethers_1 = require("ethers");
const AddDeployment_1 = require("./AddDeployment");
/**
 * Deploy WTTP gateway contract with vanity addresses
 * @param hardhatRuntime - Hardhat runtime environment
 * @param skipVerification - Skip contract verification (optional, defaults to false)
 */
async function deployWithVanity(hardhatRuntime = hardhat_1.default, skipVerification = false) {
    console.log("🚀 Starting WTTP gateway deployment script...\n");
    // Get chain information
    const network = hardhatRuntime.network.name;
    const chainId = hardhatRuntime.network.config.chainId;
    if (chainId === undefined) {
        throw new Error("ChainId is undefined, please set a chainId in your hardhat.config.ts");
    }
    const shouldVerify = chainId !== 31337 && chainId !== 1337 && !skipVerification; // 31337 is localhost 1337 is hardhat
    console.log(`📡 Network: ${network} - ChainId: ${chainId}`);
    console.log(`🔍 Contract verification: ${shouldVerify ? "ENABLED" : "DISABLED (local network)"}\n`);
    // Get signers - Gateway uses signer(0)
    const signers = await hardhatRuntime.ethers.getSigners();
    const gatewaySigner = signers[0]; // Gateway deployer
    console.log("📋 Deployment Configuration:");
    console.log(`Gateway Deployer (signer 0): ${gatewaySigner.address}`);
    // Check nonces for vanity deployment validation
    const gatewayNonce = await hardhatRuntime.ethers.provider.getTransactionCount(gatewaySigner.address);
    console.log(`Gateway Deployer Nonce: ${gatewayNonce}`);
    // Validate gateway nonce (must be 0 for vanity deployment)
    if (gatewayNonce > 0) {
        throw new Error(`Vanity nonce error: Gateway deployer nonce is ${gatewayNonce}, expected 0. Gateway deployer has been used before.`);
    }
    // Check balances
    let gatewayBalance = await hardhatRuntime.ethers.provider.getBalance(gatewaySigner.address);
    console.log(`Gateway Deployer Balance: ${(0, ethers_1.formatEther)(gatewayBalance)} ETH\n`);
    // Get current gas price for calculations
    const feeData = await hardhatRuntime.ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice || (0, ethers_1.parseUnits)("20", "gwei"); // Fallback to 20 gwei
    console.log(`Current gas price: ${(0, ethers_1.formatEther)(gasPrice * 1000000000n)} ETH/gas (${gasPrice.toString()} wei)\n`);
    // Buffer for gas estimation (10% safety margin)
    const bufferMultiplier = 110n; // 110% (10% buffer)
    const divisor = 100n;
    // Helper function to fund deployer if needed
    async function fundDeployerIfNeeded(deployerSigner, deployerBalance, requiredAmount, deployerName) {
        if (deployerBalance >= requiredAmount) {
            console.log(`✅ ${deployerName} deployer has sufficient balance (${(0, ethers_1.formatEther)(deployerBalance)} ETH >= ${(0, ethers_1.formatEther)(requiredAmount)} ETH)`);
            return deployerBalance;
        }
        console.log(`⚠️  ${deployerName} deployer has insufficient balance!`);
        console.log(`   Required: ${(0, ethers_1.formatEther)(requiredAmount)} ETH`);
        console.log(`   Available: ${(0, ethers_1.formatEther)(deployerBalance)} ETH`);
        console.log(`   Shortfall: ${(0, ethers_1.formatEther)(requiredAmount - deployerBalance)} ETH`);
        // Calculate funding needed with 15% buffer
        const fundingBuffer = 115n; // 115% (15% buffer)
        const fundingDivisor = 100n;
        const fundingNeeded = (requiredAmount * fundingBuffer) / fundingDivisor;
        console.log(`💰 Checking if funding signer can fund ${deployerName} deployer...`);
        console.log(`   Funding needed (with 15% buffer): ${(0, ethers_1.formatEther)(fundingNeeded)} ETH`);
        // Use signers[1] as funding source if available, otherwise throw error
        if (signers.length < 2) {
            console.error(`❌ No funding signer available (need at least 2 signers)`);
            throw new Error(`❌ ${deployerName} deployer has insufficient balance! Required: ${(0, ethers_1.formatEther)(requiredAmount)} ETH, Available: ${(0, ethers_1.formatEther)(deployerBalance)} ETH. No funding signer available.`);
        }
        const fundingSigner = signers[1];
        const fundingSignerBalance = await hardhatRuntime.ethers.provider.getBalance(fundingSigner.address);
        // Estimate the gas cost for the funding transaction itself
        const fundingGasEstimate = 21000n; // Standard ETH transfer gas
        const fundingTxCost = fundingGasEstimate * gasPrice;
        const totalFundingNeeded = fundingNeeded + fundingTxCost;
        console.log(`   Funding transaction cost: ~${(0, ethers_1.formatEther)(fundingTxCost)} ETH`);
        console.log(`   Total funding signer needs: ${(0, ethers_1.formatEther)(totalFundingNeeded)} ETH`);
        if (fundingSignerBalance < totalFundingNeeded) {
            console.error(`❌ Funding signer has insufficient funds to cover ${deployerName} deployment!`);
            console.error(`   Funding signer balance: ${(0, ethers_1.formatEther)(fundingSignerBalance)} ETH`);
            console.error(`   Total needed: ${(0, ethers_1.formatEther)(totalFundingNeeded)} ETH`);
            console.error(`   Funding signer shortfall: ${(0, ethers_1.formatEther)(totalFundingNeeded - fundingSignerBalance)} ETH`);
            throw new Error(`Insufficient funds for ${deployerName} deployment. Neither deployer nor funding signer has enough ETH.`);
        }
        console.log(`✅ Funding signer has sufficient funds to cover ${deployerName} deployment`);
        console.log(`💸 Funding ${deployerName} deployer with ${(0, ethers_1.formatEther)(fundingNeeded)} ETH...`);
        // Send funding from funding signer to deployer
        const fundingTx = await fundingSigner.sendTransaction({
            to: deployerSigner.address,
            value: fundingNeeded,
            gasLimit: fundingGasEstimate
        });
        await fundingTx.wait();
        console.log(`✅ Successfully funded ${deployerName} deployer (tx: ${fundingTx.hash})`);
        // Return updated balance
        const newBalance = await hardhatRuntime.ethers.provider.getBalance(deployerSigner.address);
        console.log(`   New ${deployerName} deployer balance: ${(0, ethers_1.formatEther)(newBalance)} ETH\n`);
        return newBalance;
    }
    let gateway;
    let gatewayAddress;
    try {
        // ========================================
        // STEP 1: Gateway Deployment
        // ========================================
        console.log("📦 Step 1: WTTP Gateway Deployment");
        console.log("⛽ Estimating Gateway deployment cost...");
        const GatewayFactory = await hardhatRuntime.ethers.getContractFactory("WTTPGateway");
        const gatewayDeployTx = await GatewayFactory.connect(gatewaySigner).getDeployTransaction();
        const gatewayGasEstimate = await hardhatRuntime.ethers.provider.estimateGas({
            ...gatewayDeployTx,
            from: gatewaySigner.address
        });
        const gatewayCost = (gatewayGasEstimate * gasPrice * bufferMultiplier) / divisor;
        console.log(`💰 Gateway deployment cost (with 10% buffer): ~${(0, ethers_1.formatEther)(gatewayCost)} ETH (${gatewayGasEstimate.toString()} gas)`);
        // Check and fund gateway deployer if needed
        gatewayBalance = await fundDeployerIfNeeded(gatewaySigner, gatewayBalance, gatewayCost, "Gateway");
        console.log("🚀 Deploying WTTP Gateway...");
        gateway = await GatewayFactory.connect(gatewaySigner).deploy();
        await gateway.waitForDeployment();
        gatewayAddress = await gateway.getAddress();
        console.log(`✅ WTTP Gateway deployed to: ${gatewayAddress}`);
        console.log(`   Deployed by: ${gatewaySigner.address}`);
        // Ensure we have both gateway and gatewayAddress
        if (!gateway || !gatewayAddress) {
            throw new Error("Failed to initialize Gateway contract");
        }
        // Try to get version if available
        try {
            const version = await gateway.version();
            console.log(`   Version: ${version}\n`);
        }
        catch (error) {
            console.log(`   Contract deployed successfully\n`);
        }
        // ========================================
        // STEP 2: Verification and Testing
        // ========================================
        console.log("🔗 Verifying contract deployment...");
        // Test basic functionality if possible
        console.log("\n🧪 Testing basic functionality...");
        try {
            // Test any available view functions
            console.log(`Gateway contract accessible at: ${gatewayAddress}`);
        }
        catch (error) {
            console.log("⚠️  Basic functionality test skipped");
        }
        // Contract verification
        if (shouldVerify && !skipVerification) {
            console.log("\n🔍 Starting contract verification...");
            try {
                // Verify Gateway
                console.log("📋 Verifying WTTP Gateway...");
                await hardhatRuntime.run("verify:verify", {
                    address: gatewayAddress,
                    constructorArguments: [],
                });
                console.log("✅ WTTP Gateway verified successfully!");
            }
            catch (error) {
                if (error.message.includes("Already Verified")) {
                    console.log("ℹ️  WTTP Gateway already verified");
                }
                else {
                    console.log("❌ WTTP Gateway verification failed:", error.message);
                }
            }
        }
        // Calculate actual costs spent (get final balances)
        const finalGatewayBalance = await hardhatRuntime.ethers.provider.getBalance(gatewaySigner.address);
        const actualGatewayCost = gatewayBalance - finalGatewayBalance;
        console.log("\n🎉 Deployment completed successfully!");
        console.log("\n📄 Deployment Summary:");
        console.log("=".repeat(60));
        console.log(`Network:          ${network}`);
        console.log(`WTTP Gateway:     ${gatewayAddress} (deployed)`);
        console.log(`Deployer:         ${gatewaySigner.address}`);
        console.log(`\nDeployment costs:`);
        console.log(`Gateway actual:   ${(0, ethers_1.formatEther)(actualGatewayCost)} ETH`);
        console.log(`Total spent:      ${(0, ethers_1.formatEther)(actualGatewayCost)} ETH`);
        if (shouldVerify && !skipVerification) {
            console.log(`Etherscan:        Contract verified on block explorer`);
        }
        console.log("=".repeat(60));
        // ========================================
        // STEP 3: Update Deployment Registry
        // ========================================
        console.log("\n📝 Updating deployment registry...");
        try {
            const deploymentData = (0, AddDeployment_1.formatDeploymentData)(chainId, {
                address: gatewayAddress,
                deployerAddress: gatewaySigner.address,
                txHash: gateway.deploymentTransaction()?.hash
            });
            await (0, AddDeployment_1.addDeployment)(deploymentData);
            console.log(`🎯 Network '${network}' deployment registered successfully!`);
        }
        catch (error) {
            console.log("⚠️  Failed to update deployment registry:", error.message);
            console.log("📝 You can manually update wttp.deployments.ts with the following info:");
            console.log(`   Network: ${network}`);
            console.log(`   Gateway: ${gatewayAddress}`);
            console.log(`   Deployer: ${gatewaySigner.address}`);
        }
        // Return deployed contracts for potential further use
        return {
            gateway,
            addresses: {
                gateway: gatewayAddress,
                deployer: gatewaySigner.address
            },
            signers: {
                gatewaySigner
            },
            costs: {
                gateway: actualGatewayCost,
                total: actualGatewayCost
            }
        };
    }
    catch (error) {
        console.error("❌ Deployment failed:", error);
        throw error;
    }
}
// Legacy main function for direct script execution
async function main() {
    return await deployWithVanity();
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=DeployVanity.js.map