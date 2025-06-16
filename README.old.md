# WTTP Gateway

A Web3 Transfer Protocol (WTTP) gateway implementation for decentralized web resource access. This project provides the core gateway contract and deployment infrastructure for the WTTP ecosystem.

## Overview

The WTTP Gateway serves as a protocol gateway for accessing resources from WTTP sites. It implements the core WTTP methods (OPTIONS, HEAD, GET, LOCATE) to enable decentralized web functionality through Ethereum smart contracts.

### Key Components

- **WTTPGateway Contract**: Core smart contract implementing WTTP protocol methods
- **Deployment Scripts**: Automated deployment with vanity address support
- **Resource Fetching**: Utility functions for interacting with WTTP sites
- **Hardhat Tasks**: CLI tools for deployment and resource fetching
- **Comprehensive Tests**: Full test suite with CLI integration testing

## Quick Start

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
# Run all tests
npx hardhat test

# Run specific test suite
npx hardhat test test/WTTPGateway.test.ts
npx hardhat test test/TaskCLI.test.ts

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

### Deploy Gateway

```bash
# Simple deployment
npx hardhat deploy:simple --skip-verify

# Vanity address deployment
npx hardhat deploy:vanity --skip-verify

# Verify deployed contract
npx hardhat deploy:verify --gateway 0x<gateway-address>
```

### Fetch Resources

```bash
# Basic resource fetch
npx hardhat fetch --wttp 0x<gateway> --site 0x<site> --path /resource

# Fetch with range
npx hardhat fetch --wttp 0x<gateway> --site 0x<site> --path /file --range 10-50

# HEAD request only
npx hardhat fetch --wttp 0x<gateway> --site 0x<site> --path /resource --head
```

## Project Structure

```
├── contracts/
│   └── WTTPGateway.sol          # Core gateway contract
├── ignition/
│   └── modules/
│       └── WTTPCore.ts          # Hardhat Ignition deployment module
├── scripts/
│   ├── AddDeployment.ts         # Deployment registry management
│   ├── CheckDeploymentStatus.ts # Deployment status monitoring
│   ├── DeployVanity.ts          # Vanity address deployment
│   └── fetchResource.ts         # Resource fetching utility
├── tasks/
│   ├── deploy.ts                # Deployment tasks
│   └── fetch.ts                 # Resource fetching task
├── test/                        # Comprehensive test suite
├── wttp.deployments.ts          # Deployment registry
└── hardhat.config.ts            # Hardhat configuration
```

## Available Tasks

Run `npx hardhat --help` to see all available tasks:

- **deploy:simple** - Deploy WTTP gateway contract (simple deployment)
- **deploy:vanity** - Deploy WTTP gateway contract with vanity addresses  
- **deploy:verify** - Verify deployed WTTP gateway contract on block explorer
- **fetch** - Fetch a resource from a WTTP site via the WTTPGateway

## Deployment Registry

The project maintains a deployment registry (`wttp.deployments.ts`) that tracks deployments across different networks:

```typescript
export const wttpDeployments = {
  chains: {
    [chainId]: {
      gateway: {
        contractAddress: "0x...",
        deployerAddress: "0x...", 
        deployedAt: timestamp,
        txHash: "0x..."
      }
    }
  }
};
```

## Test Suite

The project includes a comprehensive test suite covering all components:

### Test Structure

#### 1. `WTTPGateway.test.ts` - Core Contract Tests
Tests the main WTTPGateway contract functionality:
- **Deployment**: Contract deployment and basic accessibility
- **Gateway Methods**: Verification of all public methods (OPTIONS, HEAD, GET, LOCATE)
- **Error Handling**: Testing with invalid parameters and addresses
- **Contract Interface**: Validation of method signatures and expected behavior

#### 2. `DeploymentScripts.test.ts` - Deployment Infrastructure Tests
Tests the deployment scripts and registry system:
- **DeployVanity Script**: Vanity address deployment functionality
- **AddDeployment Script**: Deployment registry management
- **CheckDeploymentStatus Script**: Deployment status monitoring
- **Deployment Registry**: Registry file structure and data validation

#### 3. `FetchResource.test.ts` - Resource Fetching Tests
Tests the fetchResource utility and integration:
- **fetchResource Function**: Core resource fetching functionality
- **Request Structure Validation**: Proper WTTP request formatting
- **Error Handling**: Invalid parameters and edge cases
- **Integration with Gateway**: Interaction with deployed gateway contracts

#### 4. `IgnitionModule.test.ts` - Hardhat Ignition Tests
Tests the Hardhat Ignition deployment module:
- **WTTPCore Module**: Module structure and deployment capability
- **Ignition Integration**: Integration with Hardhat Ignition system
- **Contract Factory Integration**: Consistency between deployment methods

#### 5. `TaskCLI.test.ts` - Command Line Interface Tests
Tests all Hardhat tasks via CLI execution:
- **Task Availability**: Verification that custom tasks are loaded and listed
- **Deploy Tasks**: CLI testing of deploy:vanity, deploy:simple, deploy:verify
- **Fetch Task**: CLI testing of the fetch task with all parameters
- **Task Integration**: Help system, error handling, and network configuration
- **Parameter Validation**: Required parameters, invalid inputs, and flag handling

### Test Coverage

The test suite provides comprehensive coverage:

✅ **Contract Deployment** - Gateway contract deployment and initialization  
✅ **Method Accessibility** - All public contract methods are callable  
✅ **Error Handling** - Proper error handling for invalid inputs  
✅ **Deployment Scripts** - All deployment utilities and registry management  
✅ **Resource Fetching** - Gateway interaction through fetchResource utility  
✅ **Ignition Integration** - Hardhat Ignition module functionality  
✅ **CLI Task Integration** - Real CLI execution of all custom Hardhat tasks  
✅ **Parameter Validation** - CLI task parameter validation and error handling  
✅ **Help System** - Task help documentation and discovery  

### Test Statistics

- **Total Tests**: 62 passing, 2 pending
- **Test Files**: 5 comprehensive test suites
- **CLI Integration**: 20 CLI execution tests
- **Contract Coverage**: All public methods and deployment scenarios
- **Task Coverage**: All custom Hardhat tasks with parameter validation

### CLI Test Details

The CLI tests (`TaskCLI.test.ts`) provide comprehensive testing of the Hardhat task system:

- **Real CLI Execution**: Uses Node.js `exec` to run actual `npx hardhat` commands
- **Parameter Validation**: Tests required parameters, optional flags, and error handling
- **Help System**: Validates task help documentation and parameter descriptions
- **Network Configuration**: Tests default and custom network parameters
- **Error Scenarios**: Verifies proper error messages for invalid inputs

These tests ensure that users can successfully run all deployment and utility tasks from the command line.

## Development

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd wttp-gateway

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

### Local Development

```bash
# Start local Hardhat network
npx hardhat node

# Deploy to local network (in another terminal)
npx hardhat deploy:simple --network localhost --skip-verify

# Interact with deployed contract
npx hardhat console --network localhost
```

### Adding New Networks

To add support for new networks, update `hardhat.config.ts`:

```typescript
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // Add your network configuration
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Testing Guidelines

- Write tests for all new functionality
- Ensure all existing tests pass
- Add CLI tests for new Hardhat tasks
- Update documentation for new features

## Future Enhancements

When integrating with the full WTTP ecosystem:

1. **Integration Tests**: Add tests with real WTTP site contracts
2. **Range Processing Tests**: Test actual range processing with real data
3. **Performance Tests**: Add gas usage and performance benchmarks
4. **E2E Tests**: End-to-end tests with deployed contracts on test networks
5. **Multi-Network Tests**: Test deployment scripts across different networks

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## WTTP Protocol

For more information about the Web3 Transfer Protocol (WTTP), see the main protocol documentation.
