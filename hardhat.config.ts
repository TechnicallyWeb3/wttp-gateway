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

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

// Import tasks
import "./tasks/deploy";
import "./tasks/fetch";

console.log(process.env.GATEWAY_DEPLOYER_MNEMONIC);

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: process.env.GATEWAY_DEPLOYER_MNEMONIC ? {
        mnemonic: process.env.GATEWAY_DEPLOYER_MNEMONIC,
        count: 20,
      } : undefined,
    },
    localhost: {
      chainId: 31337,
      url: "http://localhost:8545",
      accounts: process.env.GATEWAY_DEPLOYER_MNEMONIC ? {
        mnemonic: process.env.GATEWAY_DEPLOYER_MNEMONIC,
        count: 20,
      } : undefined,
    },
  },
};

export default config;
