# WTTP Gateway - Publication Timestamp

**Original Publication Date**: January 8, 2025  
**Copyright**: TechnicallyWeb3  
**License**: AGPL-3.0  

## Code Fingerprint
This file serves as proof of original publication for the WTTP Gateway codebase.

### Core Components Published:
- WTTPGateway.sol: Unified interface for WTTP sites with range handling
- Range Processing Algorithms: Byte range and data point range resolution
- Dual Range Support: Both negative indexing and absolute positioning
- Gateway Method Implementations: GET, LOCATE, HEAD, OPTIONS
- TypeScript Integration Scripts: Deployment and resource fetching utilities

### Innovation Claims:
1. **Unified WTTP Gateway Interface**: First implementation of a standardized gateway contract that provides unified access to multiple WTTP sites with consistent response formatting across different site implementations.

2. **Dual Range Processing Algorithm**: Novel algorithm supporting both byte-level ranges and data point ranges with negative indexing capability, enabling flexible content delivery for blockchain-stored resources.

3. **Cross-Site Range Harmonization**: Architecture pattern that standardizes range request handling across heterogeneous WTTP site implementations while maintaining backward compatibility.

### Hash of Core Algorithm (Range Resolution):
```solidity
function resolveByteRange(
    address _site,
    bytes32[] memory dataPoints,
    Range memory range
) internal view returns (uint256 startIdx, uint256 endIdx, bool outOfBounds) {
    // Calculate total size across data points
    uint256 totalSize = 0;
    for (uint256 i = 0; i < dataPoints.length; i++) {
        totalSize += IDataPointStorage(IWTTPSite(_site).DPS()).dataPointSize(dataPoints[i]);
    }
    
    // Handle negative indexing for start
    if (range.start < 0) {
        if (uint256(-range.start) > totalSize) {
            return (0, 0, true); // Out of bounds
        }
        startIdx = totalSize - uint256(-range.start);
    } else {
        startIdx = uint256(range.start);
    }
    
    // Handle negative indexing for end
    if (range.end <= 0) {
        if (range.end == 0) {
            endIdx = totalSize; // End means "up to the end"
        } else if (uint256(-range.end) > totalSize) {
            return (0, 0, true); // Out of bounds
        } else {
            endIdx = totalSize - uint256(-range.end);
        }
    } else {
        endIdx = uint256(range.end);
    }
    
    // Final bounds validation
    if (startIdx > endIdx || endIdx > totalSize) {
        return (0, 0, true); // Out of bounds
    }
    
    return (startIdx, endIdx, false);
}
```

**Algorithm Hash**: `keccak256("wttp_gateway_range_resolution_v1_TW3")`

### Hash of Core Algorithm (Range Processing):
```solidity
function _processRange(
    address _site,
    bytes32[] memory dataPoints,
    uint256 startIdx,
    uint256 endIdx,
    RangeType rangeType
) internal view returns (RangedResponse memory rangeResponse) {
    rangeResponse.rangeType = rangeType;
    rangeResponse.isPartialRange = !(startIdx == 0 && endIdx == dataPoints.length);

    if (rangeType == RangeType.DATA_POINTS) {
        // Create array with only requested chunks
        bytes32[] memory _dataPoints = new bytes32[](endIdx - startIdx);
        for (uint256 i = startIdx; i < endIdx; i++) {
            _dataPoints[i - startIdx] = dataPoints[i];
        }
        rangeResponse.dataPoints = _dataPoints;
    } else if (rangeType == RangeType.BYTES) {
        // Handle byte range with data point boundary crossing
        uint256 startDP = 0;
        uint256 byteOffset = 0;
        uint256 runningSize = 0;
        IDataPointStorage dps = IDataPointStorage(IWTTPSite(_site).DPS());
        
        // Locate the data point containing the start byte
        for (uint256 i = 0; i < dataPoints.length; i++) {
            uint256 dpSize = dps.dataPointSize(dataPoints[i]);
            if (runningSize + dpSize > startIdx) {
                startDP = i;
                byteOffset = startIdx - runningSize;
                break;
            }
            runningSize += dpSize;
        }
        
        // Copy data across data point boundaries
        uint256 resultSize = endIdx - startIdx;
        bytes memory resultData = new bytes(resultSize);
        uint256 resultPos = 0;
        
        for (uint256 i = startDP; i < dataPoints.length && resultPos < resultSize; i++) {
            bytes memory dpData = dps.readDataPoint(dataPoints[i]);
            uint256 startPos = (i == startDP) ? byteOffset : 0;
            
            for (uint256 j = startPos; j < dpData.length && resultPos < resultSize; j++) {
                resultData[resultPos++] = dpData[j];
            }
        }
        
        rangeResponse.data = resultData;
    }
    
    return rangeResponse;
}
```

**Algorithm Hash**: `keccak256("wttp_gateway_process_range_v1_TW3")`

## Anti-Plagiarism Notice
This codebase contains proprietary innovations developed by TechnicallyWeb3. Any derivative works claiming these innovations as original developments will be pursued for copyright infringement under the AGPL-3.0 license terms.

**Key Innovations Protected:**
- Unified WTTP gateway interface design
- Dual range processing (byte + data point) algorithm
- Negative indexing implementation for blockchain data ranges
- Cross-data-point byte range assembly algorithm
- Gateway method standardization architecture

**Legal Contacts**: contact@technicallyweb3.com  
**Repository**: https://github.com/TechnicallyWeb3/wttp-gateway  
**Documentation**: README.md, LLM_CONTEXT.md  

## Technical Specifications
- **Solidity Version**: ^0.8.20
- **License**: AGPL-3.0
- **Dependencies**: @wttp/core, @tw3/esp
- **Primary Interface**: IWTTPSite
- **Storage Layer**: IDataPointStorage

---
*This timestamp file is part of the official WTTP Gateway publication and serves as legal proof of original authorship and algorithmic innovation by TechnicallyWeb3.* 