import { type ContractRunner } from "ethers";
import type { IDataPointRegistry, IDataPointRegistryInterface } from "../../../../../@tw3/esp/contracts/interfaces/IDataPointRegistry";
export declare class IDataPointRegistry__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "OwnableInvalidOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "OwnableUnauthorizedAccount";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DPS";
        readonly outputs: readonly [{
            readonly internalType: "contract IDataPointStorage";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_withdrawTo";
            readonly type: "address";
        }];
        readonly name: "collectRoyalties";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_dataPointAddress";
            readonly type: "bytes32";
        }];
        readonly name: "getDataPointRoyalty";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "_dataPoint";
            readonly type: "bytes";
        }, {
            readonly internalType: "address";
            readonly name: "_publisher";
            readonly type: "address";
        }];
        readonly name: "registerDataPoint";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "dataPointAddress";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_publisher";
            readonly type: "address";
        }];
        readonly name: "royaltyBalance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "royaltyRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_dps";
            readonly type: "address";
        }];
        readonly name: "setDPS";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_royaltyRate";
            readonly type: "uint256";
        }];
        readonly name: "setRoyaltyRate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_publisher";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_dataPointAddress";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "_newPublisher";
            readonly type: "address";
        }];
        readonly name: "updatePublisherAddress";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_dataPointAddress";
            readonly type: "bytes32";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "gasUsed";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "publisher";
                readonly type: "address";
            }];
            readonly internalType: "struct DataPointRoyalty";
            readonly name: "_dataPointRoyalty";
            readonly type: "tuple";
        }];
        readonly name: "updateRoyaltyRecord";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IDataPointRegistryInterface;
    static connect(address: string, runner?: ContractRunner | null): IDataPointRegistry;
}
//# sourceMappingURL=IDataPointRegistry__factory.d.ts.map