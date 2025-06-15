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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDeployment = addDeployment;
exports.formatDeploymentData = formatDeploymentData;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Add a new deployment to the WTTP deployment registry
 */
async function addDeployment(deploymentData) {
    // Skip hardhat chain
    if (deploymentData.chainId === 31337) {
        console.log(`🚫 Skipping deployment registry update for chainId ${deploymentData.chainId}`);
        return;
    }
    const registryPath = path_1.default.join(__dirname, '..', 'wttp.deployments.ts');
    try {
        // Read current registry
        const registryContent = fs_1.default.readFileSync(registryPath, 'utf8');
        // Import the current deployments dynamically
        delete require.cache[registryPath];
        const { wttpDeployments } = await Promise.resolve(`${registryPath}`).then(s => __importStar(require(s)));
        const timestamp = new Date().toISOString();
        // Update the deployments object
        if (!wttpDeployments.chains) {
            wttpDeployments.chains = {};
        }
        wttpDeployments.chains[deploymentData.chainId] = {
            gateway: {
                contractAddress: deploymentData.gateway.contractAddress,
                deployerAddress: deploymentData.gateway.deployerAddress,
                txHash: deploymentData.gateway.txHash || 'TBD',
                deployedAt: timestamp
            }
        };
        // Generate the new file content
        const newContent = generateRegistryContent(wttpDeployments);
        // Write back to file
        fs_1.default.writeFileSync(registryPath, newContent, 'utf8');
        console.log(`📝 Added/updated ${deploymentData.chainId} deployment in registry`);
        console.log(`✅ Deployment registry updated successfully`);
    }
    catch (error) {
        console.error(`❌ Failed to update deployment registry:`, error);
        throw error;
    }
}
/**
 * Generate the properly formatted TypeScript file content
 */
function generateRegistryContent(deployments) {
    const header = `/**
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

/**
 * Ethereum Storage Protocol (ESP) - Deployment Registry
 * 
 * This file tracks all ESP contract deployments across different networks.
 * Used for reference, integration, and deployment management.
 * 
 * @version 0.2.0
 * @license AGPL-3.0
 */

/**
 * ESP Deployments - Simple Contract Registry
 * Tracks deployed contract addresses and deployment info across networks
 */

export const wttpDeployments = {
  chains: {`;
    const footer = `  }
};

export default wttpDeployments;`;
    // Generate chains content
    const chainEntries = [];
    const chainIds = Object.keys(deployments.chains).sort((a, b) => Number(a) - Number(b));
    for (const chainId of chainIds) {
        const chain = deployments.chains[chainId];
        const chainEntry = `    ${chainId}: {
      gateway: {
        contractAddress: '${chain.gateway.contractAddress}',
        deployerAddress: '${chain.gateway.deployerAddress}',
        txHash: '${chain.gateway.txHash}',
        deployedAt: '${chain.gateway.deployedAt}'
      }
    }`;
        chainEntries.push(chainEntry);
    }
    const chainsContent = chainEntries.join(',\n');
    return header + '\n' + chainsContent + '\n' + footer;
}
/**
 * Quick helper to format deployment data from deploy script results
 */
function formatDeploymentData(chainId, gatewayResult) {
    return {
        chainId,
        gateway: {
            contractAddress: gatewayResult.address,
            deployerAddress: gatewayResult.deployerAddress,
            txHash: gatewayResult.txHash
        }
    };
}
//# sourceMappingURL=AddDeployment.js.map