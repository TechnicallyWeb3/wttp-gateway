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

import hre from "hardhat";
import { formatEther } from "ethers";

async function main() {
  console.log("🔍 Checking WTTP deployment status...\n");

  const network = hre.network.name;
  console.log(`📡 Network: ${network}\n`);

  // Get the same signers as the deployment script
  const signers = await hre.ethers.getSigners();
  const gatewaySigner = signers[0]; // Gateway deployer

  console.log("📋 Checking Deployer Address:");
  console.log(`Gateway Deployer: ${gatewaySigner.address}\n`);

  // Check nonces
  console.log("🔢 Checking current nonces:");
  const gatewayNonce = await hre.ethers.provider.getTransactionCount(gatewaySigner.address);

  console.log(`Gateway Deployer nonce: ${gatewayNonce}\n`);

  // Check pending nonces (includes pending transactions)
  console.log("⏳ Checking pending nonces (includes pending txs):");
  const gatewayPendingNonce = await hre.ethers.provider.getTransactionCount(gatewaySigner.address, "pending");

  console.log(`Gateway Deployer pending nonce: ${gatewayPendingNonce}\n`);

  // Analyze the situation
  console.log("📊 Analysis:");
  
  if (gatewayPendingNonce > gatewayNonce) {
    console.log("⏳ Gateway deployment transaction is PENDING in mempool");
    console.log(`   Confirmed nonce: ${gatewayNonce}, Pending nonce: ${gatewayPendingNonce}`);
    console.log("   → Transaction submitted but not confirmed yet");
  } else if (gatewayNonce > 0) {
    console.log("✅ Gateway deployment transaction confirmed");
    
    // Try to find the Gateway contract
    const expectedGatewayAddress = hre.ethers.getCreateAddress({
      from: gatewaySigner.address,
      nonce: 0
    });
    console.log(`Expected Gateway address: ${expectedGatewayAddress}`);
    
    const gatewayCode = await hre.ethers.provider.getCode(expectedGatewayAddress);
    if (gatewayCode !== "0x") {
      console.log("✅ Gateway contract confirmed deployed and accessible");
    } else {
      console.log("❌ Gateway contract not found at expected address");
    }
  } else {
    console.log("❌ Gateway deployment not started or transaction not submitted");
  }

  // Check balances
  console.log("\n💰 Current balances:");
  const gatewayBalance = await hre.ethers.provider.getBalance(gatewaySigner.address);

  console.log(`Gateway Deployer: ${formatEther(gatewayBalance)} ETH`);

  // Get current gas price
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  console.log(`\n⛽ Current gas price: ${gasPrice?.toString()} wei`);

  // Recommendations
  console.log("\n🎯 Recommendations:");
  
  if (gatewayPendingNonce > gatewayNonce) {
    console.log("1. ✅ Your transaction IS submitted and pending");
    console.log("2. ⏳ Wait for network confirmation (this is normal)");
    console.log("3. 🔍 You can check the transaction on block explorer");
    console.log("4. ⚠️  If stuck for >10 minutes, gas might be too low");
  } else if (gatewayNonce === 0 && gatewayPendingNonce === 0) {
    console.log("1. ❌ No Gateway transaction detected in mempool");
    console.log("2. 🔄 The deployment script may have failed silently");
    console.log("3. 🛑 Cancel the current script and restart deployment");
  } else {
    console.log("1. ✅ Check if deployment completed successfully");
    console.log("2. 🔍 Verify contract is accessible at expected address");
  }

  // Check if we're on a testnet and can provide explorer links
  if (network === "sepolia") {
    console.log("\n🔗 Sepolia Explorer Links:");
    console.log(`Gateway Deployer: https://sepolia.etherscan.io/address/${gatewaySigner.address}`);
    
    if (gatewayNonce > 0 || gatewayPendingNonce > 0) {
      const expectedGatewayAddress = hre.ethers.getCreateAddress({
        from: gatewaySigner.address,
        nonce: 0
      });
      console.log(`Expected Gateway: https://sepolia.etherscan.io/address/${expectedGatewayAddress}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Status check failed:", error);
    process.exit(1);
  }); 