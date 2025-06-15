import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../../../common";
export interface IDataPointStorageInterface extends Interface {
    getFunction(nameOrSignature: "VERSION" | "calculateAddress" | "dataPointSize" | "readDataPoint" | "writeDataPoint"): FunctionFragment;
    encodeFunctionData(functionFragment: "VERSION", values?: undefined): string;
    encodeFunctionData(functionFragment: "calculateAddress", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "dataPointSize", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "readDataPoint", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "writeDataPoint", values: [BytesLike]): string;
    decodeFunctionResult(functionFragment: "VERSION", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calculateAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dataPointSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "readDataPoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "writeDataPoint", data: BytesLike): Result;
}
export interface IDataPointStorage extends BaseContract {
    connect(runner?: ContractRunner | null): IDataPointStorage;
    waitForDeployment(): Promise<this>;
    interface: IDataPointStorageInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    VERSION: TypedContractMethod<[], [bigint], "view">;
    calculateAddress: TypedContractMethod<[_data: BytesLike], [string], "view">;
    dataPointSize: TypedContractMethod<[
        _dataPointAddress: BytesLike
    ], [
        bigint
    ], "view">;
    readDataPoint: TypedContractMethod<[
        _dataPointAddress: BytesLike
    ], [
        string
    ], "view">;
    writeDataPoint: TypedContractMethod<[
        _data: BytesLike
    ], [
        string
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "VERSION"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "calculateAddress"): TypedContractMethod<[_data: BytesLike], [string], "view">;
    getFunction(nameOrSignature: "dataPointSize"): TypedContractMethod<[_dataPointAddress: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "readDataPoint"): TypedContractMethod<[_dataPointAddress: BytesLike], [string], "view">;
    getFunction(nameOrSignature: "writeDataPoint"): TypedContractMethod<[_data: BytesLike], [string], "nonpayable">;
    filters: {};
}
//# sourceMappingURL=IDataPointStorage.d.ts.map