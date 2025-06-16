# WTTP Gateway Package Source

This directory contains the source code for the WTTP Gateway npm package, providing TypeScript types, contract interfaces, and deployment utilities for the WTTP Gateway system.

## Structure

```
src/
├── index.ts          # Main package exports
├── types.ts          # TypeScript type definitions
├── contracts.ts      # Contract utility functions
├── deployments.ts    # Deployment management utilities
└── README.md         # This file
```

## Key Features

### 1. Contract Types (`types.ts`)
- Exports `WTTPGateway` contract interface
- Exports `WTTPGateway__factory` for contract instantiation
- Re-exports common struct types (HEADRequest, GETResponse, etc.)

### 2. Contract Utilities (`contracts.ts`)
- `supportedChain(chainId)` - Check if a chain has gateway deployment
- `loadGateway(chainId, provider)` - Load gateway contract instance
- `getGatewayAddress(chainId)` - Get gateway contract address

### 3. Deployment Management (`deployments.ts`)
- `getContractAddress(chainId, 'gateway')` - Get contract address
- `getDeploymentInfo(chainId, 'gateway')` - Get full deployment info
- `getSupportedChainIds()` - List all supported chain IDs
- `loadContract(chainId, 'gateway', provider)` - Load contract instance
- `addLocalhostDeployment(data)` - Add local test deployment
- `removeLocalhostDeployment(chainId)` - Remove local test deployment
- `listAllDeployments()` - List all deployments
- `hasLocalhostDeployment(chainId)` - Check for local deployment

## Usage Examples

### Basic Usage
```typescript
import { 
  WTTPGateway, 
  WTTPGateway__factory,
  supportedChain,
  loadGateway,
  getGatewayAddress 
} from 'wttp-gateway';

// Check if chain is supported
if (supportedChain(5)) {
  console.log('Goerli is supported!');
}

// Get gateway address
const address = getGatewayAddress(5);

// Load gateway contract
const gateway = loadGateway(5, provider);
```

### Deployment Management
```typescript
import { 
  addLocalhostDeployment,
  removeLocalhostDeployment,
  getSupportedChainIds 
} from 'wttp-gateway';

// Add localhost deployment for testing
addLocalhostDeployment({
  chainId: 31337,
  gateway: {
    contractAddress: '0x...',
    deployerAddress: '0x...',
    txHash: '0x...'
  }
});

// List supported chains
const chains = getSupportedChainIds();
console.log('Supported chains:', chains);
```

### Contract Interaction
```typescript
import { loadContract } from 'wttp-gateway';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('...');
const gateway = loadContract(5, 'gateway', provider);

// Call gateway methods
const optionsResponse = await gateway.OPTIONS(siteAddress, '/path');
const headResponse = await gateway.HEAD(siteAddress, headRequest);
```

## Local Development Testing

The package supports adding localhost deployments for testing:

```typescript
import { addLocalhostDeployment, removeLocalhostDeployment } from 'wttp-gateway';

// Add test deployment
addLocalhostDeployment({
  chainId: 31337, // Hardhat default
  gateway: {
    contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    deployerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  }
}, { 
  overwrite: true,
  description: 'Local test deployment' 
});

// Remove when done
removeLocalhostDeployment(31337);
```

## Migration from ESP

This package was refactored from the ESP (Ethereum Storage Protocol) system. Key changes:

- **Single Contract**: Only tracks the Gateway contract (vs ESP's DPS/DPR)
- **Simplified Interface**: Functions work with 'gateway' instead of 'dps'/'dpr'
- **Updated Types**: Uses WTTPGateway types instead of DataPoint types
- **Same Utilities**: Maintains the same helper functions for deployment management

## Build Process

The source is compiled to multiple formats:
- **CommonJS**: `dist/cjs/src/`
- **ES Modules**: `dist/esm/src/`
- **Type Definitions**: `dist/types/src/`

Build with: `npm run build`