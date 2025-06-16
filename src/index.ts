/**
 * Ethereum Storage Protocol (ESP) - Main Package Export
 * 
 * This package provides TypeScript types, contract interfaces, and deployment
 * information for the Ethereum Storage Protocol.
 * 
 * @version 0.2.0
 * @license AGPL-3.0
 */

// Export ESP-specific contract types and factories
export {
  DataPointRegistry,
  DataPointRegistry__factory,
  DataPointStorage,
  DataPointStorage__factory,
  IDataPointRegistry,
  IDataPointRegistry__factory,
  IDataPointStorage,
  IDataPointStorage__factory
} from './types';

// Export contract interfaces and utilities
export * from './contracts';

// Export deployment information
export {
  espDeployments,
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