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
import hre from "hardhat";
/**
 * Deploy WTTP gateway contract with vanity addresses
 * @param hardhatRuntime - Hardhat runtime environment
 * @param skipVerification - Skip contract verification (optional, defaults to false)
 */
export declare function deployWithVanity(hardhatRuntime?: typeof hre, skipVerification?: boolean): Promise<{
    gateway: any;
    addresses: {
        gateway: string;
        deployer: string;
    };
    signers: {
        gatewaySigner: import("@nomicfoundation/hardhat-ethers/signers").HardhatEthersSigner;
    };
    costs: {
        gateway: bigint;
        total: bigint;
    };
}>;
//# sourceMappingURL=DeployVanity.d.ts.map