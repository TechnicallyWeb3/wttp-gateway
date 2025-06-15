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

import fs from 'fs';
import path from 'path';

interface DeploymentData {
  chainId: number;
  gateway: {
    contractAddress: string;
    deployerAddress: string;
    txHash?: string;
  };
}

/**
 * Add a new deployment to the WTTP deployment registry
 */
export async function addDeployment(deploymentData: DeploymentData): Promise<void> {
  // Skip hardhat chain
  if (deploymentData.chainId === 31337) {
    console.log(`🚫 Skipping deployment registry update for chainId ${deploymentData.chainId}`);
    return;
  }

  const registryPath = path.join(__dirname, '..', 'wttp.deployments.ts');
  
  try {
    // Read current registry
    const registryContent = fs.readFileSync(registryPath, 'utf8');
    
    // Import the current deployments dynamically
    delete require.cache[registryPath];
    const { wttpDeployments } = await import(registryPath);
    
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
    fs.writeFileSync(registryPath, newContent, 'utf8');
    
    console.log(`📝 Added/updated ${deploymentData.chainId} deployment in registry`);
    console.log(`✅ Deployment registry updated successfully`);
    
  } catch (error) {
    console.error(`❌ Failed to update deployment registry:`, error);
    throw error;
  }
}

/**
 * Generate the properly formatted TypeScript file content
 */
function generateRegistryContent(deployments: any): string {
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
  const chainEntries: string[] = [];
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
export function formatDeploymentData(
  chainId: number,
  gatewayResult: { address: string; deployerAddress: string; txHash?: string }
): DeploymentData {
  return {
    chainId,
    gateway: {
      contractAddress: gatewayResult.address,
      deployerAddress: gatewayResult.deployerAddress,
      txHash: gatewayResult.txHash
    }
  };
}