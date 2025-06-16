/**
 * WTTP Gateway Contract Utilities
 * 
 * Utility functions for working with WTTP Gateway contracts
 */

import { WTTPGateway, WTTPGateway__factory } from './types';
import { Provider, Signer } from 'ethers';

/**
 * Check if a chain has WTTP Gateway deployment
 * @param chainId - The chain ID to check
 * @returns true if the chain has a gateway deployment
 */
export function supportedChain(chainId: number): boolean {
  const { getContractAddress } = require('./deployments');
  return !!getContractAddress(chainId, 'gateway');
}

/**
 * Load a WTTP Gateway contract instance
 * @param chainId - The chain ID
 * @param providerOrSigner - Ethers provider or signer
 * @returns WTTPGateway contract instance
 */
export function loadGateway(
  chainId: number, 
  providerOrSigner: Provider | Signer
): WTTPGateway {
  const { getContractAddress } = require('./deployments');
  const contractAddress = getContractAddress(chainId, 'gateway');
  
  if (!contractAddress) {
    throw new Error(`Gateway contract address not found for chainId: ${chainId}`);
  }
  
  return WTTPGateway__factory.connect(contractAddress, providerOrSigner);
}

/**
 * Get the gateway contract address for a specific chain
 * @param chainId - The chain ID
 * @returns Contract address or undefined if not deployed
 */
export function getGatewayAddress(chainId: number): string | undefined {
  const { getContractAddress } = require('./deployments');
  return getContractAddress(chainId, 'gateway');
}