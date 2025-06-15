import { type ContractRunner } from "ethers";
import type { IDataPointStorage, IDataPointStorageInterface } from "../../../../../@tw3/esp/contracts/interfaces/IDataPointStorage";
export declare class IDataPointStorage__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "VERSION";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "calculateAddress";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_dataPointAddress";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_dataPointAddress";
            readonly type: "bytes32";
        }];
        readonly name: "dataPointSize";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_dataPointAddress";
            readonly type: "bytes32";
        }];
        readonly name: "readDataPoint";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "writeDataPoint";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_dataPointAddress";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IDataPointStorageInterface;
    static connect(address: string, runner?: ContractRunner | null): IDataPointStorage;
}
//# sourceMappingURL=IDataPointStorage__factory.d.ts.map