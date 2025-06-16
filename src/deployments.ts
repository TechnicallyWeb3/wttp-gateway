/**
 * ESP Deployment Information and Utilities
 * 
 * Re-exports esp.deployments.ts with additional utility functions
 */
import { DataPointRegistry } from '../typechain-types/contracts/DataPointRegistry';
import { DataPointStorage } from '../typechain-types/contracts/DataPointStorage';
import { DataPointRegistry__factory } from '../typechain-types/factories/contracts/DataPointRegistry__factory';
import { DataPointStorage__factory } from '../typechain-types/factories/contracts/DataPointStorage__factory';
import { Provider } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

export { espDeployments, default } from '../esp.deployments';
export type { 
  DataPointRegistry, 
  DataPointStorage,
  DataPointRegistry__factory,
  DataPointStorage__factory
} from './types';

// Types for deployment management
export interface LocalDeploymentData {
  chainId: number;
  dps: {
    contractAddress: string;
    deployerAddress: string;
    txHash?: string;
    deployedAt?: string;
  };
  dpr: {
    contractAddress: string;
    deployerAddress: string;
    txHash?: string;
    deployedAt?: string;
    constructors: {
      ownerAddress: string;
      dpsAddress: string;
      royaltyRate: string; // in wei
    };
  };
}

// Cache for modified deployments to avoid file I/O on every call
let _modifiedDeployments: any = null;

// Utility functions for working with deployments
export function getContractAddress(chainId: number, contract: 'dps' | 'dpr') {
  const deployments = _getDeployments();
  return deployments.chains[chainId]?.[contract]?.contractAddress;
}

export function getDeploymentInfo(chainId: number, contract: 'dps' | 'dpr') {
  const deployments = _getDeployments();
  return deployments.chains[chainId]?.[contract];
}

export function getSupportedChainIds() {
  const deployments = _getDeployments();
  return Object.keys(deployments.chains).map(Number);
} 

export function loadContract(chainId: number, contract: 'dps' | 'dpr', provider: Provider | null = null) : undefined | DataPointStorage | DataPointRegistry {
  const contractAddress = getContractAddress(chainId, contract);

  if (!contractAddress) {
    throw new Error(`Contract address not found for chainId: ${chainId} and contract: ${contract}`);
  }

  let contractInstance = undefined;
  if (contract === 'dps') {
    contractInstance = DataPointRegistry__factory.connect(contractAddress, provider);
  } else {
    contractInstance = DataPointStorage__factory.connect(contractAddress, provider);
  }

  return contractInstance;
}

/**
 * Add a localhost deployment to your local package copy
 * This allows testing with your own deployed contracts without testnet tokens
 * 
 * @param deploymentData - The deployment information to add
 * @param options - Configuration options
 */
export function addLocalhostDeployment(
  deploymentData: LocalDeploymentData,
  options: { 
    overwrite?: boolean;
    description?: string;
  } = {}
): void {
  // Only allow localhost/hardhat networks
  if (deploymentData.chainId !== 31337 && deploymentData.chainId !== 1337) {
    throw new Error(`addLocalhostDeployment only accepts localhost networks (chainId 31337 or 1337), got ${deploymentData.chainId}`);
  }

  const { overwrite = false, description } = options;
  
  try {
    const deploymentsPath = _getDeploymentsFilePath();
    const deployments = _getDeployments();
    
    // Check if deployment already exists
    if (deployments.chains[deploymentData.chainId] && !overwrite) {
      throw new Error(`Deployment for chainId ${deploymentData.chainId} already exists. Use { overwrite: true } to replace it.`);
    }
    
    const timestamp = new Date().toISOString();
    
    // Create the new deployment entry
    const newDeployment = {
      dps: {
        contractAddress: deploymentData.dps.contractAddress,
        deployerAddress: deploymentData.dps.deployerAddress,
        txHash: deploymentData.dps.txHash || 'manual-entry',
        deployedAt: timestamp,
        ...(description && { description })
      },
      dpr: {
        contractAddress: deploymentData.dpr.contractAddress,
        deployerAddress: deploymentData.dpr.deployerAddress,
        txHash: deploymentData.dpr.txHash || 'manual-entry',
        deployedAt: timestamp,
        constructors: deploymentData.dpr.constructors,
        ...(description && { description })
      }
    };
    
    // Add to deployments
    deployments.chains[deploymentData.chainId] = newDeployment;
    
    // Update the in-memory cache
    _modifiedDeployments = deployments;
    
    // Write to file (this modifies the user's local copy)
    _writeDeploymentsFile(deploymentsPath, deployments);
    
    console.log(`✅ Added localhost deployment for chainId ${deploymentData.chainId}`);
    console.log(`📍 DPS: ${deploymentData.dps.contractAddress}`);
    console.log(`📍 DPR: ${deploymentData.dpr.contractAddress}`);
    
  } catch (error) {
    console.error(`❌ Failed to add localhost deployment:`, error);
    throw error;
  }
}

/**
 * Remove a localhost deployment from your local package copy
 * 
 * @param chainId - The chain ID to remove (must be localhost: 31337 or 1337)
 */
export function removeLocalhostDeployment(chainId: number): void {
  if (chainId !== 31337 && chainId !== 1337) {
    throw new Error(`removeLocalhostDeployment only accepts localhost networks (chainId 31337 or 1337), got ${chainId}`);
  }
  
  try {
    const deploymentsPath = _getDeploymentsFilePath();
    const deployments = _getDeployments();
    
    if (!deployments.chains[chainId]) {
      console.log(`ℹ️  No deployment found for chainId ${chainId}`);
      return;
    }
    
    delete deployments.chains[chainId];
    _modifiedDeployments = deployments;
    _writeDeploymentsFile(deploymentsPath, deployments);
    
    console.log(`✅ Removed localhost deployment for chainId ${chainId}`);
    
  } catch (error) {
    console.error(`❌ Failed to remove localhost deployment:`, error);
    throw error;
  }
}

/**
 * List all deployments including any localhost ones you've added
 */
export function listAllDeployments(): { [chainId: number]: any } {
  const deployments = _getDeployments();
  return deployments.chains;
}

/**
 * Check if a localhost deployment exists
 */
export function hasLocalhostDeployment(chainId: number = 31337): boolean {
  const deployments = _getDeployments();
  return !!deployments.chains[chainId];
}

// Internal helper functions

function _getDeployments() {
  // Return cached version if we have modifications
  if (_modifiedDeployments) {
    return _modifiedDeployments;
  }
  
  // Otherwise load from the original file
  return require('../esp.deployments').espDeployments;
}

function _getDeploymentsFilePath(): string {
  // The compiled files will be in dist/cjs/src/ or dist/esm/src/
  // The esp.deployments.ts file is at the package root
  // So we need to go up from dist/cjs/src/ or dist/esm/src/ to reach the root
  // const relativePath = path.join(__dirname, '..', 'esp.deployments.ts');
  
  // if (fs.existsSync(relativePath)) {
  //   return relativePath;
  // }

  // all build files are js, ts is only in the package root, which won't change via this script

  const relativePathJs = path.join(__dirname, '..', 'esp.deployments.js');
  
  if (fs.existsSync(relativePathJs)) {
    return relativePathJs;
  }
  
  // // Fallback: try to find it by walking up the directory tree
  // let currentDir = __dirname;
  // for (let i = 0; i < 5; i++) { // Limit search depth
  //   const potentialPath = path.join(currentDir, 'esp.deployments.ts');
  //   if (fs.existsSync(potentialPath)) {
  //     return potentialPath;
  //   }
  //   currentDir = path.dirname(currentDir);
  // }
  
  throw new Error('Could not find esp.deployments.js file');
}

function _writeDeploymentsFile(filePath: string, deployments: any): void {
  // Read the current file to preserve the structure
  const currentContent = fs.readFileSync(filePath, 'utf8');
  
  // Find the chains object and replace it
  const chainsStart = currentContent.indexOf('chains: {');
  const chainsEnd = _findMatchingBrace(currentContent, chainsStart + 'chains: '.length);
  
  if (chainsStart === -1 || chainsEnd === -1) {
    throw new Error('Could not parse esp.deployments.ts file structure');
  }
  
  // Generate the new chains content
  const chainsContent = JSON.stringify(deployments.chains, null, 4)
    .replace(/^{/, '')
    .replace(/}$/, '')
    .split('\n')
    .map((line, index) => index === 0 ? line : `  ${line}`)
    .join('\n');
  
  // Reconstruct the file
  const beforeChains = currentContent.substring(0, chainsStart + 'chains: {'.length);
  const afterChains = currentContent.substring(chainsEnd);
  
  const newContent = beforeChains + '\n' + chainsContent + '\n  ' + afterChains;
  
  fs.writeFileSync(filePath, newContent, 'utf8');
}

function _findMatchingBrace(content: string, startPos: number): number {
  let braceCount = 1;
  let i = content.indexOf('{', startPos) + 1;
  
  while (i < content.length && braceCount > 0) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0) return i;
    i++;
  }
  
  return -1;
}