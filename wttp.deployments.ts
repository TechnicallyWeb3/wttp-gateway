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
  chains: {
    0: {
      gateway: {
        contractAddress: '0xDA7A3A73d3bAf09AE79Bac612f03B4c0d51859dB',
        deployerAddress: '0xA717E0c570c86387a023ecf95805e2416e6d50EF',
        txHash: '0x6ae0d874cbeaeeefeec882c80e65bd55c024dc73e2fe16f6c142b0db71bd0d52',
        deployedAt: '2025-05-31T18:47:24.000Z'
      }
    },
    5: {
      gateway: {
        contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        deployerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        txHash: '0xdifferentTxHash',
        deployedAt: '2025-06-04T04:26:46.765Z'
      }
    },
    1337: {
      gateway: {
        contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        deployerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        txHash: '0xd66559ccb54a8875c0415c702c49b68f32d2a3f76909319ce87da373cb97bf92',
        deployedAt: '2025-06-04T04:26:46.729Z'
      }
    }
  }
};

export default wttpDeployments;