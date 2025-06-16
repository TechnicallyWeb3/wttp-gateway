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

// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@wttp/core/contracts/interfaces/IBaseWTTPSite.sol";

/// @title WTTP Gateway Contract
/// @notice Provides a unified interface for accessing WTTP sites with extended functionality
/// @dev Acts as an intermediary layer between clients and WTTP sites, adding range handling capabilities
///      and standardizing response formats across different site implementations
/// @custom:security WTTP_GATEWAY_TW3_2025_v1
contract WTTPGateway {
    
    /// @notice Forwards OPTIONS requests to a specified site
    /// @dev Simply passes the request through without modification
    /// @param _site Address of the target WTTP site contract
    /// @param _path The path to the resource
    /// @return _optionsResponse The response from the site containing allowed methods
    function OPTIONS(
        address _site, 
        string memory _path
    ) public view returns (OPTIONSResponse memory _optionsResponse) {
        return IBaseWTTPSite(_site).OPTIONS(_path);
    }

    /// @notice Forwards HEAD requests to a specified site
    /// @dev Simply passes the request through without modification
    /// @param _site Address of the target WTTP site contract
    /// @param _headRequest The HEAD request parameters including path and conditional headers
    /// @return _headResponse Response containing metadata without content
    function HEAD(
        address _site, 
        HEADRequest memory _headRequest
    ) public view returns (HEADResponse memory _headResponse) {
        return IBaseWTTPSite(_site).HEAD(_headRequest);
    }

    /// @notice Modifier to check if the site allows LOCATE requests
    /// @dev Performs a preflight check by calling OPTIONS and verifying the LOCATE method is allowed
    /// @param _site Address of the target WTTP site contract
    /// @param _path The path to the resource
    modifier locateAllowed(address _site, string memory _path) {
        uint16 methods = IBaseWTTPSite(_site).OPTIONS(_path).allow;
        if(methods & uint16(Method.LOCATE) == 0) {
            revert _405("Method Not Allowed", methods, false);
        }
        _;
    }

    /// @notice Internal function to process data point sizes
    /// @dev Calculates individual and total sizes for an array of data points
    /// @param _dps The Data Point Storage contract interface
    /// @param _dataPoints Array of data point addresses to process
    /// @return _sizes Structure containing individual sizes and total size
    function _processDataPointSize(
        IDataPointStorage _dps,
        bytes32[] memory _dataPoints
    ) internal view returns (DataPointSizes memory _sizes) {
        uint256 dataPointLength = _dataPoints.length;
        if (dataPointLength == 0) {
            return DataPointSizes(new uint256[](0), 0);
        }

        uint256[] memory dataPointSizes = new uint256[](dataPointLength);
        uint256 totalSize;
        for (uint256 i; i < dataPointLength; i++) {
            dataPointSizes[i] = _dps.dataPointSize(_dataPoints[i]);
            totalSize += dataPointSizes[i];
        }
        _sizes = DataPointSizes(dataPointSizes, totalSize);
    }

    /// @notice Handles LOCATE requests with secure size information
    /// @dev Extends the base LOCATE functionality with data point size calculations
    /// @param _site Address of the target WTTP site contract
    /// @param _locateRequest The LOCATE request parameters
    /// @return _locateResponse Response containing resource location and size information
    function LOCATE(
        address _site, 
        LOCATERequest memory _locateRequest
    ) external view locateAllowed(_site, _locateRequest.head.path) 
    returns (LOCATEResponseSecure memory _locateResponse) {
        
        // load site and storage contract
        IBaseWTTPSite site = IBaseWTTPSite(_site);
        IDataPointStorage DPS = IDataPointStorage(site.DPS());

        LOCATEResponse memory locateResponse = site.GET(_locateRequest);
        return LOCATEResponseSecure(
            locateResponse, 
            _processDataPointSize(DPS, locateResponse.resource.dataPoints)
        );
    }

    /// @notice Internal function to process data from data points
    /// @dev Handles byte range requests and data point concatenation
    /// @param _dps The Data Point Storage contract interface
    /// @param _dataPoints Array of data point addresses to process
    /// @param _range Range of bytes to extract from the data points
    /// @return _processedData Structure containing processed data and size information
    function _processData(
        IDataPointStorage _dps, 
        bytes32[] memory _dataPoints,
        Range memory _range // range of bytes to extract from the dataPoints, unlike the request range, which spans the resource
    ) internal view returns (ProcessedData memory _processedData) {

        DataPointSizes memory sizes = _processDataPointSize(_dps, _dataPoints);
        _range = normalizeRange_(_range, sizes.totalSize);
        // -1 for length to index conversion 
        uint256 dataPointLength = _dataPoints.length;
        uint256 dataLength = uint256(int256(1) + _range.end - _range.start);
        if (dataPointLength == 0 || dataLength == 0) {
            // empty datapoints or 0 length range
            return ProcessedData(new bytes(0), sizes);
        }
        bytes memory data = new bytes(dataLength);
        uint256 startOffset = uint256(_range.start);
        uint256 bytesWritten;

        for (uint256 i; i < dataPointLength && bytesWritten < dataLength; i++) {
            uint256 dataPointSize = sizes.sizes[i];
            if (startOffset > dataPointSize) {
                // havent found starting dataPoint yet
                startOffset -= dataPointSize;
            } else if (startOffset == 0 && bytesWritten + dataPointSize <= dataLength) {
                // write the whole dataPoint
                bytes memory dp = _dps.readDataPoint(_dataPoints[i]);
                assembly {
                    // memcpy via identity pre-compile (address 0x04)
                    let len := mload(dp)                       // == dataPointSize
                    let src := add(dp, 32)                     // skip length slot
                    let dst := add(add(data, 32), bytesWritten)
                    pop(staticcall(gas(), 4, src, len, dst, len))
                }
                bytesWritten += dataPointSize;
            } else if (startOffset == 0) {
                // write the partial dataPoint at the end of the data
                bytes memory dataPointData = _dps.readDataPoint(_dataPoints[i]);
                assembly {
                    // Calculate how many bytes we need to copy
                    let bytesToCopy := sub(dataLength, bytesWritten)
                    // Copy the bytes from dataPointData to data
                    let src := add(add(dataPointData, 32), 0) // Skip length prefix
                    let dst := add(add(data, 32), bytesWritten) // Skip length prefix
                    // Copy the bytes
                    pop(staticcall(gas(), 4, src, bytesToCopy, dst, bytesToCopy))
                }
                bytesWritten += dataLength - bytesWritten;
                break;
            }
            
            if (startOffset > 0 && startOffset < dataPointSize) {
                // we just found the starting dataPoint this iteration
                // it's not a full datapoint since startOffset is not 0
                // write the partial dataPoint at the start of the data
                bytes memory dataPointData = _dps.readDataPoint(_dataPoints[i]);
                assembly {
                    // Calculate how many bytes we need to copy
                    let bytesToCopy := sub(dataPointSize, startOffset)
                    // Copy the bytes from dataPointData to data
                    let src := add(add(dataPointData, 32), startOffset) // Skip length prefix
                    let dst := add(add(data, 32), bytesWritten) // Skip length prefix
                    // Copy the bytes
                    pop(staticcall(gas(), 4, src, bytesToCopy, dst, bytesToCopy))
                }
                bytesWritten += dataPointSize - startOffset;
                startOffset = 0;
            }
        }

        _processedData = ProcessedData(data, sizes);

    }

    /// @notice Handles GET requests with byte range support
    /// @dev First locates the resource, then processes any byte range request
    /// @param _site Address of the target WTTP site contract
    /// @param _getRequest The GET request parameters including any byte range
    /// @return _getResponse Response with either full data or the requested byte range
    function GET(
        address _site, 
        GETRequest memory _getRequest
    ) public view returns (GETResponse memory _getResponse) {

        IBaseWTTPSite site = IBaseWTTPSite(_site);
        LOCATEResponse memory locateResponse = site.GET(_getRequest.locate);
        IDataPointStorage DPS = IDataPointStorage(site.DPS());
        ProcessedData memory processedData = _processData(
            DPS,
            locateResponse.resource.dataPoints,
            _getRequest.rangeBytes
        );

        uint256 dataLength = processedData.data.length;

        if (dataLength == 0) {
            locateResponse.head.status = 204;
        } else if (dataLength < locateResponse.head.metadata.size) {
            locateResponse.head.status = 206;
        }

        return GETResponse(
            locateResponse.head,
            processedData
        );
    }
}
