# WTTP Gateway

A Web3 Transfer Protocol (WTTP) gateway implementation for decentralized web resource access. This project provides the core gateway contract for the WTTP ecosystem.

## Overview

The WTTP Gateway serves as a protocol gateway for accessing resources from WTTP sites. It implements the core WTTP methods (OPTIONS, HEAD, GET, LOCATE) to enable decentralized web functionality through Ethereum smart contracts.

### Key Features

- **Resource Location**: Secure resource location with data point size verification
- **Range Handling**: Efficient byte range request processing
- **Data Point Processing**: Optimized data point concatenation and size calculation
- **Method Validation**: Pre-flight checks for method availability
- **Standardized Responses**: Consistent response formats across different site implementations

## Contract Architecture

### WTTPGateway Contract

The main gateway contract (`WTTPGateway.sol`) implements the following core functionalities:

#### Public Methods

- **OPTIONS**: Query available methods for a resource
- **HEAD**: Retrieve resource metadata without content
- **GET**: Fetch resource content with optional byte range support
- **LOCATE**: Get resource location with secure size information

#### Internal Functions

- **_processDataPointSize**: Calculate data point sizes and totals
- **_processData**: Handle byte range requests and data concatenation

#### Modifiers

- **locateAllowed**: Pre-flight check for LOCATE method availability

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
```

### Testing

```bash
# Run all tests
npx hardhat test

# Run specific test suite
npx hardhat test test/WTTPGateway.test.ts

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

## Test Suite

The project includes a comprehensive test suite covering all contract functionality:

### Test Structure

#### Contract Tests (`WTTPGateway.test.ts`)
Tests the main WTTPGateway contract functionality:
- **Gateway Methods**: Verification of all public methods (OPTIONS, HEAD, GET, LOCATE)
- **Error Handling**: Testing with invalid parameters and addresses
- **Contract Interface**: Validation of method signatures and expected behavior
- **Range Processing**: Byte range request handling and validation
- **Data Point Handling**: Data point size calculation and concatenation

### Test Coverage

The test suite provides comprehensive coverage of the contract functionality:

✅ **Method Accessibility** - All public contract methods are callable  
✅ **Error Handling** - Proper error handling for invalid inputs  
✅ **Range Processing** - Byte range request handling and validation  
✅ **Data Point Processing** - Size calculation and data concatenation  
✅ **Method Validation** - Pre-flight checks and method availability  
✅ **Response Format** - Standardized response structure validation  

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md) for responsible disclosure.
