import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../../../common";
export type DataPointRoyaltyStruct = {
    gasUsed: BigNumberish;
    publisher: AddressLike;
};
export type DataPointRoyaltyStructOutput = [
    gasUsed: bigint,
    publisher: string
] & {
    gasUsed: bigint;
    publisher: string;
};
export interface IDataPointRegistryInterface extends Interface {
    getFunction(nameOrSignature: "DPS" | "collectRoyalties" | "getDataPointRoyalty" | "owner" | "registerDataPoint" | "renounceOwnership" | "royaltyBalance" | "royaltyRate" | "setDPS" | "setRoyaltyRate" | "transfer" | "transferOwnership" | "updatePublisherAddress" | "updateRoyaltyRecord"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "DPS", values?: undefined): string;
    encodeFunctionData(functionFragment: "collectRoyalties", values: [BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "getDataPointRoyalty", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "registerDataPoint", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "royaltyBalance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "royaltyRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "setDPS", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "setRoyaltyRate", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "transfer", values: [AddressLike, BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "updatePublisherAddress", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "updateRoyaltyRecord", values: [BytesLike, DataPointRoyaltyStruct]): string;
    decodeFunctionResult(functionFragment: "DPS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "collectRoyalties", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDataPointRoyalty", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerDataPoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "royaltyBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "royaltyRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDPS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRoyaltyRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updatePublisherAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateRoyaltyRecord", data: BytesLike): Result;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface IDataPointRegistry extends BaseContract {
    connect(runner?: ContractRunner | null): IDataPointRegistry;
    waitForDeployment(): Promise<this>;
    interface: IDataPointRegistryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    DPS: TypedContractMethod<[], [string], "view">;
    collectRoyalties: TypedContractMethod<[
        _amount: BigNumberish,
        _withdrawTo: AddressLike
    ], [
        void
    ], "nonpayable">;
    getDataPointRoyalty: TypedContractMethod<[
        _dataPointAddress: BytesLike
    ], [
        bigint
    ], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    registerDataPoint: TypedContractMethod<[
        _dataPoint: BytesLike,
        _publisher: AddressLike
    ], [
        string
    ], "payable">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    royaltyBalance: TypedContractMethod<[
        _publisher: AddressLike
    ], [
        bigint
    ], "view">;
    royaltyRate: TypedContractMethod<[], [bigint], "view">;
    setDPS: TypedContractMethod<[_dps: AddressLike], [void], "nonpayable">;
    setRoyaltyRate: TypedContractMethod<[
        _royaltyRate: BigNumberish
    ], [
        void
    ], "nonpayable">;
    transfer: TypedContractMethod<[
        _publisher: AddressLike,
        _amount: BigNumberish,
        _to: AddressLike
    ], [
        void
    ], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    updatePublisherAddress: TypedContractMethod<[
        _dataPointAddress: BytesLike,
        _newPublisher: AddressLike
    ], [
        void
    ], "nonpayable">;
    updateRoyaltyRecord: TypedContractMethod<[
        _dataPointAddress: BytesLike,
        _dataPointRoyalty: DataPointRoyaltyStruct
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "DPS"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "collectRoyalties"): TypedContractMethod<[
        _amount: BigNumberish,
        _withdrawTo: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "getDataPointRoyalty"): TypedContractMethod<[_dataPointAddress: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "registerDataPoint"): TypedContractMethod<[
        _dataPoint: BytesLike,
        _publisher: AddressLike
    ], [
        string
    ], "payable">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "royaltyBalance"): TypedContractMethod<[_publisher: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "royaltyRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "setDPS"): TypedContractMethod<[_dps: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "setRoyaltyRate"): TypedContractMethod<[_royaltyRate: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
        _publisher: AddressLike,
        _amount: BigNumberish,
        _to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "updatePublisherAddress"): TypedContractMethod<[
        _dataPointAddress: BytesLike,
        _newPublisher: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "updateRoyaltyRecord"): TypedContractMethod<[
        _dataPointAddress: BytesLike,
        _dataPointRoyalty: DataPointRoyaltyStruct
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
//# sourceMappingURL=IDataPointRegistry.d.ts.map