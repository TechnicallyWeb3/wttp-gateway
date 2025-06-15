import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../../../common";
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
export type DEFINERequestStruct = {
    head: HEADRequestStruct;
    data: HeaderInfoStruct;
};
export type DEFINERequestStructOutput = [
    head: HEADRequestStructOutput,
    data: HeaderInfoStructOutput
] & {
    head: HEADRequestStructOutput;
    data: HeaderInfoStructOutput;
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
export type DEFINEResponseStruct = {
    head: HEADResponseStruct;
    headerAddress: BytesLike;
};
export type DEFINEResponseStructOutput = [
    head: HEADResponseStructOutput,
    headerAddress: string
] & {
    head: HEADResponseStructOutput;
    headerAddress: string;
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
export type OPTIONSResponseStruct = {
    status: BigNumberish;
    allow: BigNumberish;
};
export type OPTIONSResponseStructOutput = [status: bigint, allow: bigint] & {
    status: bigint;
    allow: bigint;
};
export type DataRegistrationStruct = {
    data: BytesLike;
    chunkIndex: BigNumberish;
    publisher: AddressLike;
};
export type DataRegistrationStructOutput = [
    data: string,
    chunkIndex: bigint,
    publisher: string
] & {
    data: string;
    chunkIndex: bigint;
    publisher: string;
};
export type PATCHRequestStruct = {
    head: HEADRequestStruct;
    data: DataRegistrationStruct[];
};
export type PATCHRequestStructOutput = [
    head: HEADRequestStructOutput,
    data: DataRegistrationStructOutput[]
] & {
    head: HEADRequestStructOutput;
    data: DataRegistrationStructOutput[];
};
export type PUTRequestStruct = {
    head: HEADRequestStruct;
    properties: ResourcePropertiesStruct;
    data: DataRegistrationStruct[];
};
export type PUTRequestStructOutput = [
    head: HEADRequestStructOutput,
    properties: ResourcePropertiesStructOutput,
    data: DataRegistrationStructOutput[]
] & {
    head: HEADRequestStructOutput;
    properties: ResourcePropertiesStructOutput;
    data: DataRegistrationStructOutput[];
};
export interface IBaseWTTPSiteInterface extends Interface {
    getFunction(nameOrSignature: "DEFINE" | "DELETE" | "DPR" | "DPS" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "PUT" | "changeSiteAdmin" | "createResourceRole" | "getRoleAdmin" | "getSiteAdminRole" | "grantRole" | "hasRole" | "renounceRole" | "revokeRole"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "RoleAdminChanged" | "RoleGranted" | "RoleRevoked"): EventFragment;
    encodeFunctionData(functionFragment: "DEFINE", values: [DEFINERequestStruct]): string;
    encodeFunctionData(functionFragment: "DELETE", values: [HEADRequestStruct]): string;
    encodeFunctionData(functionFragment: "DPR", values?: undefined): string;
    encodeFunctionData(functionFragment: "DPS", values?: undefined): string;
    encodeFunctionData(functionFragment: "GET", values: [LOCATERequestStruct]): string;
    encodeFunctionData(functionFragment: "HEAD", values: [HEADRequestStruct]): string;
    encodeFunctionData(functionFragment: "OPTIONS", values: [string]): string;
    encodeFunctionData(functionFragment: "PATCH", values: [PATCHRequestStruct]): string;
    encodeFunctionData(functionFragment: "PUT", values: [PUTRequestStruct]): string;
    encodeFunctionData(functionFragment: "changeSiteAdmin", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "createResourceRole", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getRoleAdmin", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getSiteAdminRole", values?: undefined): string;
    encodeFunctionData(functionFragment: "grantRole", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "hasRole", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceRole", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "revokeRole", values: [BytesLike, AddressLike]): string;
    decodeFunctionResult(functionFragment: "DEFINE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "DELETE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "DPR", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "DPS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "GET", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "HEAD", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "OPTIONS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "PATCH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "PUT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeSiteAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createResourceRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRoleAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSiteAdminRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
}
export declare namespace RoleAdminChangedEvent {
    type InputTuple = [
        role: BytesLike,
        previousAdminRole: BytesLike,
        newAdminRole: BytesLike
    ];
    type OutputTuple = [
        role: string,
        previousAdminRole: string,
        newAdminRole: string
    ];
    interface OutputObject {
        role: string;
        previousAdminRole: string;
        newAdminRole: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RoleGrantedEvent {
    type InputTuple = [
        role: BytesLike,
        account: AddressLike,
        sender: AddressLike
    ];
    type OutputTuple = [role: string, account: string, sender: string];
    interface OutputObject {
        role: string;
        account: string;
        sender: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RoleRevokedEvent {
    type InputTuple = [
        role: BytesLike,
        account: AddressLike,
        sender: AddressLike
    ];
    type OutputTuple = [role: string, account: string, sender: string];
    interface OutputObject {
        role: string;
        account: string;
        sender: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface IBaseWTTPSite extends BaseContract {
    connect(runner?: ContractRunner | null): IBaseWTTPSite;
    waitForDeployment(): Promise<this>;
    interface: IBaseWTTPSiteInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    DEFINE: TypedContractMethod<[
        defineRequest: DEFINERequestStruct
    ], [
        DEFINEResponseStructOutput
    ], "nonpayable">;
    DELETE: TypedContractMethod<[
        deleteRequest: HEADRequestStruct
    ], [
        HEADResponseStructOutput
    ], "nonpayable">;
    DPR: TypedContractMethod<[], [string], "view">;
    DPS: TypedContractMethod<[], [string], "view">;
    GET: TypedContractMethod<[
        getRequest: LOCATERequestStruct
    ], [
        LOCATEResponseStructOutput
    ], "view">;
    HEAD: TypedContractMethod<[
        headRequest: HEADRequestStruct
    ], [
        HEADResponseStructOutput
    ], "view">;
    OPTIONS: TypedContractMethod<[
        _path: string
    ], [
        OPTIONSResponseStructOutput
    ], "view">;
    PATCH: TypedContractMethod<[
        patchRequest: PATCHRequestStruct
    ], [
        LOCATEResponseStructOutput
    ], "payable">;
    PUT: TypedContractMethod<[
        putRequest: PUTRequestStruct
    ], [
        LOCATEResponseStructOutput
    ], "payable">;
    changeSiteAdmin: TypedContractMethod<[
        _newSiteAdmin: BytesLike
    ], [
        void
    ], "nonpayable">;
    createResourceRole: TypedContractMethod<[
        _role: BytesLike
    ], [
        void
    ], "nonpayable">;
    getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;
    getSiteAdminRole: TypedContractMethod<[], [string], "view">;
    grantRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    hasRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        boolean
    ], "view">;
    renounceRole: TypedContractMethod<[
        role: BytesLike,
        callerConfirmation: AddressLike
    ], [
        void
    ], "nonpayable">;
    revokeRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "DEFINE"): TypedContractMethod<[
        defineRequest: DEFINERequestStruct
    ], [
        DEFINEResponseStructOutput
    ], "nonpayable">;
    getFunction(nameOrSignature: "DELETE"): TypedContractMethod<[
        deleteRequest: HEADRequestStruct
    ], [
        HEADResponseStructOutput
    ], "nonpayable">;
    getFunction(nameOrSignature: "DPR"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "DPS"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "GET"): TypedContractMethod<[
        getRequest: LOCATERequestStruct
    ], [
        LOCATEResponseStructOutput
    ], "view">;
    getFunction(nameOrSignature: "HEAD"): TypedContractMethod<[
        headRequest: HEADRequestStruct
    ], [
        HEADResponseStructOutput
    ], "view">;
    getFunction(nameOrSignature: "OPTIONS"): TypedContractMethod<[
        _path: string
    ], [
        OPTIONSResponseStructOutput
    ], "view">;
    getFunction(nameOrSignature: "PATCH"): TypedContractMethod<[
        patchRequest: PATCHRequestStruct
    ], [
        LOCATEResponseStructOutput
    ], "payable">;
    getFunction(nameOrSignature: "PUT"): TypedContractMethod<[
        putRequest: PUTRequestStruct
    ], [
        LOCATEResponseStructOutput
    ], "payable">;
    getFunction(nameOrSignature: "changeSiteAdmin"): TypedContractMethod<[_newSiteAdmin: BytesLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "createResourceRole"): TypedContractMethod<[_role: BytesLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "getRoleAdmin"): TypedContractMethod<[role: BytesLike], [string], "view">;
    getFunction(nameOrSignature: "getSiteAdminRole"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "grantRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "hasRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "renounceRole"): TypedContractMethod<[
        role: BytesLike,
        callerConfirmation: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "revokeRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "RoleAdminChanged"): TypedContractEvent<RoleAdminChangedEvent.InputTuple, RoleAdminChangedEvent.OutputTuple, RoleAdminChangedEvent.OutputObject>;
    getEvent(key: "RoleGranted"): TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
    getEvent(key: "RoleRevoked"): TypedContractEvent<RoleRevokedEvent.InputTuple, RoleRevokedEvent.OutputTuple, RoleRevokedEvent.OutputObject>;
    filters: {
        "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<RoleAdminChangedEvent.InputTuple, RoleAdminChangedEvent.OutputTuple, RoleAdminChangedEvent.OutputObject>;
        RoleAdminChanged: TypedContractEvent<RoleAdminChangedEvent.InputTuple, RoleAdminChangedEvent.OutputTuple, RoleAdminChangedEvent.OutputObject>;
        "RoleGranted(bytes32,address,address)": TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
        RoleGranted: TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
        "RoleRevoked(bytes32,address,address)": TypedContractEvent<RoleRevokedEvent.InputTuple, RoleRevokedEvent.OutputTuple, RoleRevokedEvent.OutputObject>;
        RoleRevoked: TypedContractEvent<RoleRevokedEvent.InputTuple, RoleRevokedEvent.OutputTuple, RoleRevokedEvent.OutputObject>;
    };
}
//# sourceMappingURL=IBaseWTTPSite.d.ts.map