import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../common";
export type HEADRequestStruct = {
    path: string;
    ifModifiedSince: BigNumberish;
    ifNoneMatch: BytesLike;
};
export type HEADRequestStructOutput = [
    path: string,
    ifModifiedSince: bigint,
    ifNoneMatch: string
] & {
    path: string;
    ifModifiedSince: bigint;
    ifNoneMatch: string;
};
export type RangeStruct = {
    start: BigNumberish;
    end: BigNumberish;
};
export type RangeStructOutput = [start: bigint, end: bigint] & {
    start: bigint;
    end: bigint;
};
export type LOCATERequestStruct = {
    head: HEADRequestStruct;
    rangeChunks: RangeStruct;
};
export type LOCATERequestStructOutput = [
    head: HEADRequestStructOutput,
    rangeChunks: RangeStructOutput
] & {
    head: HEADRequestStructOutput;
    rangeChunks: RangeStructOutput;
};
export type GETRequestStruct = {
    locate: LOCATERequestStruct;
    rangeBytes: RangeStruct;
};
export type GETRequestStructOutput = [
    locate: LOCATERequestStructOutput,
    rangeBytes: RangeStructOutput
] & {
    locate: LOCATERequestStructOutput;
    rangeBytes: RangeStructOutput;
};
export type CacheControlStruct = {
    immutableFlag: boolean;
    preset: BigNumberish;
    custom: string;
};
export type CacheControlStructOutput = [
    immutableFlag: boolean,
    preset: bigint,
    custom: string
] & {
    immutableFlag: boolean;
    preset: bigint;
    custom: string;
};
export type CORSPolicyStruct = {
    methods: BigNumberish;
    origins: BytesLike[];
    preset: BigNumberish;
    custom: string;
};
export type CORSPolicyStructOutput = [
    methods: bigint,
    origins: string[],
    preset: bigint,
    custom: string
] & {
    methods: bigint;
    origins: string[];
    preset: bigint;
    custom: string;
};
export type RedirectStruct = {
    code: BigNumberish;
    location: string;
};
export type RedirectStructOutput = [code: bigint, location: string] & {
    code: bigint;
    location: string;
};
export type HeaderInfoStruct = {
    cache: CacheControlStruct;
    cors: CORSPolicyStruct;
    redirect: RedirectStruct;
};
export type HeaderInfoStructOutput = [
    cache: CacheControlStructOutput,
    cors: CORSPolicyStructOutput,
    redirect: RedirectStructOutput
] & {
    cache: CacheControlStructOutput;
    cors: CORSPolicyStructOutput;
    redirect: RedirectStructOutput;
};
export type ResourcePropertiesStruct = {
    mimeType: BytesLike;
    charset: BytesLike;
    encoding: BytesLike;
    language: BytesLike;
};
export type ResourcePropertiesStructOutput = [
    mimeType: string,
    charset: string,
    encoding: string,
    language: string
] & {
    mimeType: string;
    charset: string;
    encoding: string;
    language: string;
};
export type ResourceMetadataStruct = {
    properties: ResourcePropertiesStruct;
    size: BigNumberish;
    version: BigNumberish;
    lastModified: BigNumberish;
    header: BytesLike;
};
export type ResourceMetadataStructOutput = [
    properties: ResourcePropertiesStructOutput,
    size: bigint,
    version: bigint,
    lastModified: bigint,
    header: string
] & {
    properties: ResourcePropertiesStructOutput;
    size: bigint;
    version: bigint;
    lastModified: bigint;
    header: string;
};
export type HEADResponseStruct = {
    status: BigNumberish;
    headerInfo: HeaderInfoStruct;
    metadata: ResourceMetadataStruct;
    etag: BytesLike;
};
export type HEADResponseStructOutput = [
    status: bigint,
    headerInfo: HeaderInfoStructOutput,
    metadata: ResourceMetadataStructOutput,
    etag: string
] & {
    status: bigint;
    headerInfo: HeaderInfoStructOutput;
    metadata: ResourceMetadataStructOutput;
    etag: string;
};
export type DataPointSizesStruct = {
    sizes: BigNumberish[];
    totalSize: BigNumberish;
};
export type DataPointSizesStructOutput = [
    sizes: bigint[],
    totalSize: bigint
] & {
    sizes: bigint[];
    totalSize: bigint;
};
export type ProcessedDataStruct = {
    data: BytesLike;
    sizes: DataPointSizesStruct;
};
export type ProcessedDataStructOutput = [
    data: string,
    sizes: DataPointSizesStructOutput
] & {
    data: string;
    sizes: DataPointSizesStructOutput;
};
export type GETResponseStruct = {
    head: HEADResponseStruct;
    body: ProcessedDataStruct;
};
export type GETResponseStructOutput = [
    head: HEADResponseStructOutput,
    body: ProcessedDataStructOutput
] & {
    head: HEADResponseStructOutput;
    body: ProcessedDataStructOutput;
};
export type ResourceResponseStruct = {
    dataPoints: BytesLike[];
    totalChunks: BigNumberish;
};
export type ResourceResponseStructOutput = [
    dataPoints: string[],
    totalChunks: bigint
] & {
    dataPoints: string[];
    totalChunks: bigint;
};
export type LOCATEResponseStruct = {
    head: HEADResponseStruct;
    resource: ResourceResponseStruct;
};
export type LOCATEResponseStructOutput = [
    head: HEADResponseStructOutput,
    resource: ResourceResponseStructOutput
] & {
    head: HEADResponseStructOutput;
    resource: ResourceResponseStructOutput;
};
export type LOCATEResponseSecureStruct = {
    locate: LOCATEResponseStruct;
    structure: DataPointSizesStruct;
};
export type LOCATEResponseSecureStructOutput = [
    locate: LOCATEResponseStructOutput,
    structure: DataPointSizesStructOutput
] & {
    locate: LOCATEResponseStructOutput;
    structure: DataPointSizesStructOutput;
};
export type OPTIONSResponseStruct = {
    status: BigNumberish;
    allow: BigNumberish;
};
export type OPTIONSResponseStructOutput = [status: bigint, allow: bigint] & {
    status: bigint;
    allow: bigint;
};
export interface WTTPGatewayInterface extends Interface {
    getFunction(nameOrSignature: "GET" | "HEAD" | "LOCATE" | "OPTIONS"): FunctionFragment;
    encodeFunctionData(functionFragment: "GET", values: [AddressLike, GETRequestStruct]): string;
    encodeFunctionData(functionFragment: "HEAD", values: [AddressLike, HEADRequestStruct]): string;
    encodeFunctionData(functionFragment: "LOCATE", values: [AddressLike, LOCATERequestStruct]): string;
    encodeFunctionData(functionFragment: "OPTIONS", values: [AddressLike, string]): string;
    decodeFunctionResult(functionFragment: "GET", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "HEAD", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "LOCATE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "OPTIONS", data: BytesLike): Result;
}
export interface WTTPGateway extends BaseContract {
    connect(runner?: ContractRunner | null): WTTPGateway;
    waitForDeployment(): Promise<this>;
    interface: WTTPGatewayInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    GET: TypedContractMethod<[
        _site: AddressLike,
        _getRequest: GETRequestStruct
    ], [
        GETResponseStructOutput
    ], "view">;
    HEAD: TypedContractMethod<[
        _site: AddressLike,
        _headRequest: HEADRequestStruct
    ], [
        HEADResponseStructOutput
    ], "view">;
    LOCATE: TypedContractMethod<[
        _site: AddressLike,
        _locateRequest: LOCATERequestStruct
    ], [
        LOCATEResponseSecureStructOutput
    ], "view">;
    OPTIONS: TypedContractMethod<[
        _site: AddressLike,
        _path: string
    ], [
        OPTIONSResponseStructOutput
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "GET"): TypedContractMethod<[
        _site: AddressLike,
        _getRequest: GETRequestStruct
    ], [
        GETResponseStructOutput
    ], "view">;
    getFunction(nameOrSignature: "HEAD"): TypedContractMethod<[
        _site: AddressLike,
        _headRequest: HEADRequestStruct
    ], [
        HEADResponseStructOutput
    ], "view">;
    getFunction(nameOrSignature: "LOCATE"): TypedContractMethod<[
        _site: AddressLike,
        _locateRequest: LOCATERequestStruct
    ], [
        LOCATEResponseSecureStructOutput
    ], "view">;
    getFunction(nameOrSignature: "OPTIONS"): TypedContractMethod<[
        _site: AddressLike,
        _path: string
    ], [
        OPTIONSResponseStructOutput
    ], "view">;
    filters: {};
}
//# sourceMappingURL=WTTPGateway.d.ts.map