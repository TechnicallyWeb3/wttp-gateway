/**
 * WTTP Gateway - Main Package Export
 * 
 * This package provides TypeScript types, contract interfaces, and deployment
 * information for the WTTP Gateway system.
 * 
 * @version 0.0.1
 * @license AGPL-3.0
 */

// Export WTTP Gateway contract types and factories
export {
  WTTPGateway,
  WTTPGateway__factory,
} from './types';

// Export contract interfaces and utilities
export * from './contracts';

// Export deployment information
export {
  wttpDeployments,
  loadContract,
  getContractAddress,
  getDeploymentInfo,
  getSupportedChainIds,
  addLocalhostDeployment,
  removeLocalhostDeployment,
  listAllDeployments,
  hasLocalhostDeployment,
  LocalDeploymentData
} from './deployments';

// Re-export types for convenience
export * from './types'; 