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

import { task, types } from "hardhat/config";

task("deploy:vanity", "Deploy WTTP gateway contract with vanity addresses")
  .addFlag(
    "skipVerify",
    "Skip contract verification on block explorer (verification enabled by default)"
  )
  .setAction(async (taskArgs, hre) => {
    console.log(`🚀 WTTP Gateway Vanity Deployment Task`);
    console.log(`🌐 Network: ${hre.network.name}\n`);

    const { skipVerify } = taskArgs;
    
    try {
      // Import the deployment logic inside the task to avoid circular imports
      const { deployWithVanity } = await import("../scripts/DeployVanity");
      
      // Determine verification setting
      const shouldSkipVerification = skipVerify || false;
      console.log(`🔍 Contract verification: ${shouldSkipVerification ? "DISABLED" : "ENABLED"}`);
      
      // Call the deployment function
      const result = await deployWithVanity(hre, shouldSkipVerification);
      
      console.log(`\n🎉 Vanity deployment completed successfully!`);
      console.log(`📍 Gateway: ${result.addresses.gateway}`);
      console.log(`📍 Deployer: ${result.addresses.deployer}`);
      
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    }
  });

task("deploy:simple", "Deploy WTTP gateway contract (simple deployment)")
  .addFlag(
    "skipVerify",
    "Skip contract verification on block explorer (verification enabled by default)"
  )
  .setAction(async (taskArgs, hre) => {
    console.log(`🚀 WTTP Gateway Simple Deployment Task`);
    console.log(`🌐 Network: ${hre.network.name}\n`);

    const { skipVerify } = taskArgs;
    
    try {
      // Get deployer
      const signers = await hre.ethers.getSigners();
      const deployer = signers[0];
      console.log(`👤 Deployer: ${deployer.address}`);
      
      // Deploy gateway contract
      console.log(`🚀 Deploying WTTP Gateway...`);
      
      const GatewayFactory = await hre.ethers.getContractFactory("WTTPGateway");
      const gateway = await GatewayFactory.deploy();
      await gateway.waitForDeployment();
      
      const gatewayAddress = await gateway.getAddress();
      
      console.log(`\n✅ Deployment completed successfully!`);
      console.log(`📍 WTTP Gateway: ${gatewayAddress}`);
      console.log(`👤 Deployer: ${deployer.address}`);
      
      // Verify contract if not skipped
      if (!skipVerify && hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log(`\n🔍 Verifying contract...`);
        
        try {
          await hre.run("deploy:verify", {
            gateway: gatewayAddress
          });
        } catch (verifyError) {
          console.log(`⚠️  Verification failed: ${verifyError}`);
          console.log(`You can verify manually using:`);
          console.log(`npx hardhat deploy:verify --gateway ${gatewayAddress} --network ${hre.network.name}`);
        }
      }
      
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    }
  });

task("deploy:verify", "Verify deployed WTTP gateway contract on block explorer")
  .addParam("gateway", "WTTP Gateway contract address", undefined, types.string)
  .setAction(async (taskArgs, hre) => {
    const { gateway } = taskArgs;
    
    console.log(`🔍 Verifying WTTP Gateway contract on ${hre.network.name}...`);
    
    try {
      // Verify WTTP Gateway
      console.log("📋 Verifying WTTP Gateway...");
      await hre.run("verify:verify", {
        address: gateway,
        constructorArguments: [],
      });
      console.log("✅ WTTP Gateway verified!");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("ℹ️  WTTP Gateway already verified");
      } else {
        console.log("❌ WTTP Gateway verification failed:", error.message);
      }
    }
  }); 