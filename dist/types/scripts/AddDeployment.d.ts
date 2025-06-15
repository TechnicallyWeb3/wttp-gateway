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
interface DeploymentData {
    chainId: number;
    gateway: {
        contractAddress: string;
        deployerAddress: string;
        txHash?: string;
    };
}
/**
 * Add a new deployment to the WTTP deployment registry
 */
export declare function addDeployment(deploymentData: DeploymentData): Promise<void>;
/**
 * Quick helper to format deployment data from deploy script results
 */
export declare function formatDeploymentData(chainId: number, gatewayResult: {
    address: string;
    deployerAddress: string;
    txHash?: string;
}): DeploymentData;
export {};
//# sourceMappingURL=AddDeployment.d.ts.map