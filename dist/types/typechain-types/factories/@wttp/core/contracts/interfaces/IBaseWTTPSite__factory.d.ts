import { type ContractRunner } from "ethers";
import type { IBaseWTTPSite, IBaseWTTPSiteInterface } from "../../../../../@wttp/core/contracts/interfaces/IBaseWTTPSite";
export declare class IBaseWTTPSite__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "AccessControlBadConfirmation";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "neededRole";
            readonly type: "bytes32";
        }];
        readonly name: "AccessControlUnauthorizedAccount";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }, {
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "previousAdminRole";
            readonly type: "bytes32";
        }, {
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "newAdminRole";
            readonly type: "bytes32";
        }];
        readonly name: "RoleAdminChanged";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "RoleGranted";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "RoleRevoked";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "string";
                    readonly name: "path";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "ifModifiedSince";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "ifNoneMatch";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADRequest";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "bool";
                        readonly name: "immutableFlag";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "enum CachePreset";
                        readonly name: "preset";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "string";
                        readonly name: "custom";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct CacheControl";
                    readonly name: "cache";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "uint16";
                        readonly name: "methods";
                        readonly type: "uint16";
                    }, {
                        readonly internalType: "bytes32[]";
                        readonly name: "origins";
                        readonly type: "bytes32[]";
                    }, {
                        readonly internalType: "enum CORSPreset";
                        readonly name: "preset";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "string";
                        readonly name: "custom";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct CORSPolicy";
                    readonly name: "cors";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "uint16";
                        readonly name: "code";
                        readonly type: "uint16";
                    }, {
                        readonly internalType: "string";
                        readonly name: "location";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct Redirect";
                    readonly name: "redirect";
                    readonly type: "tuple";
                }];
                readonly internalType: "struct HeaderInfo";
                readonly name: "data";
                readonly type: "tuple";
            }];
            readonly internalType: "struct DEFINERequest";
            readonly name: "defineRequest";
            readonly type: "tuple";
        }];
        readonly name: "DEFINE";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint16";
                    readonly name: "status";
                    readonly type: "uint16";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bool";
                            readonly name: "immutableFlag";
                            readonly type: "bool";
                        }, {
                            readonly internalType: "enum CachePreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CacheControl";
                        readonly name: "cache";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "methods";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "bytes32[]";
                            readonly name: "origins";
                            readonly type: "bytes32[]";
                        }, {
                            readonly internalType: "enum CORSPreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CORSPolicy";
                        readonly name: "cors";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "code";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "string";
                            readonly name: "location";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct Redirect";
                        readonly name: "redirect";
                        readonly type: "tuple";
                    }];
                    readonly internalType: "struct HeaderInfo";
                    readonly name: "headerInfo";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bytes2";
                            readonly name: "mimeType";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "charset";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "encoding";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "language";
                            readonly type: "bytes2";
                        }];
                        readonly internalType: "struct ResourceProperties";
                        readonly name: "properties";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "size";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "version";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "lastModified";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "header";
                        readonly type: "bytes32";
                    }];
                    readonly internalType: "struct ResourceMetadata";
                    readonly name: "metadata";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "etag";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADResponse";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly internalType: "bytes32";
                readonly name: "headerAddress";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct DEFINEResponse";
            readonly name: "defineResponse";
            readonly type: "tuple";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "path";
                readonly type: "string";
            }, {
                readonly internalType: "uint256";
                readonly name: "ifModifiedSince";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes32";
                readonly name: "ifNoneMatch";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct HEADRequest";
            readonly name: "deleteRequest";
            readonly type: "tuple";
        }];
        readonly name: "DELETE";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint16";
                readonly name: "status";
                readonly type: "uint16";
            }, {
                readonly components: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "bool";
                        readonly name: "immutableFlag";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "enum CachePreset";
                        readonly name: "preset";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "string";
                        readonly name: "custom";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct CacheControl";
                    readonly name: "cache";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "uint16";
                        readonly name: "methods";
                        readonly type: "uint16";
                    }, {
                        readonly internalType: "bytes32[]";
                        readonly name: "origins";
                        readonly type: "bytes32[]";
                    }, {
                        readonly internalType: "enum CORSPreset";
                        readonly name: "preset";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "string";
                        readonly name: "custom";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct CORSPolicy";
                    readonly name: "cors";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "uint16";
                        readonly name: "code";
                        readonly type: "uint16";
                    }, {
                        readonly internalType: "string";
                        readonly name: "location";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct Redirect";
                    readonly name: "redirect";
                    readonly type: "tuple";
                }];
                readonly internalType: "struct HeaderInfo";
                readonly name: "headerInfo";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "bytes2";
                        readonly name: "mimeType";
                        readonly type: "bytes2";
                    }, {
                        readonly internalType: "bytes2";
                        readonly name: "charset";
                        readonly type: "bytes2";
                    }, {
                        readonly internalType: "bytes2";
                        readonly name: "encoding";
                        readonly type: "bytes2";
                    }, {
                        readonly internalType: "bytes2";
                        readonly name: "language";
                        readonly type: "bytes2";
                    }];
                    readonly internalType: "struct ResourceProperties";
                    readonly name: "properties";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "size";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "version";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "lastModified";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "header";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct ResourceMetadata";
                readonly name: "metadata";
                readonly type: "tuple";
            }, {
                readonly internalType: "bytes32";
                readonly name: "etag";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct HEADResponse";
            readonly name: "deleteResponse";
            readonly type: "tuple";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "DPR";
        readonly outputs: readonly [{
            readonly internalType: "contract IDataPointRegistry";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
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
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "string";
                    readonly name: "path";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "ifModifiedSince";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "ifNoneMatch";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADRequest";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "int256";
                    readonly name: "start";
                    readonly type: "int256";
                }, {
                    readonly internalType: "int256";
                    readonly name: "end";
                    readonly type: "int256";
                }];
                readonly internalType: "struct Range";
                readonly name: "rangeChunks";
                readonly type: "tuple";
            }];
            readonly internalType: "struct LOCATERequest";
            readonly name: "getRequest";
            readonly type: "tuple";
        }];
        readonly name: "GET";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint16";
                    readonly name: "status";
                    readonly type: "uint16";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bool";
                            readonly name: "immutableFlag";
                            readonly type: "bool";
                        }, {
                            readonly internalType: "enum CachePreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CacheControl";
                        readonly name: "cache";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "methods";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "bytes32[]";
                            readonly name: "origins";
                            readonly type: "bytes32[]";
                        }, {
                            readonly internalType: "enum CORSPreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CORSPolicy";
                        readonly name: "cors";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "code";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "string";
                            readonly name: "location";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct Redirect";
                        readonly name: "redirect";
                        readonly type: "tuple";
                    }];
                    readonly internalType: "struct HeaderInfo";
                    readonly name: "headerInfo";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bytes2";
                            readonly name: "mimeType";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "charset";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "encoding";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "language";
                            readonly type: "bytes2";
                        }];
                        readonly internalType: "struct ResourceProperties";
                        readonly name: "properties";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "size";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "version";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "lastModified";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "header";
                        readonly type: "bytes32";
                    }];
                    readonly internalType: "struct ResourceMetadata";
                    readonly name: "metadata";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "etag";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADResponse";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "dataPoints";
                    readonly type: "bytes32[]";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "totalChunks";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct ResourceResponse";
                readonly name: "resource";
                readonly type: "tuple";
            }];
            readonly internalType: "struct LOCATEResponse";
            readonly name: "getResponse";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "path";
                readonly type: "string";
            }, {
                readonly internalType: "uint256";
                readonly name: "ifModifiedSince";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes32";
                readonly name: "ifNoneMatch";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct HEADRequest";
            readonly name: "headRequest";
            readonly type: "tuple";
        }];
        readonly name: "HEAD";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint16";
                readonly name: "status";
                readonly type: "uint16";
            }, {
                readonly components: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "bool";
                        readonly name: "immutableFlag";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "enum CachePreset";
                        readonly name: "preset";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "string";
                        readonly name: "custom";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct CacheControl";
                    readonly name: "cache";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "uint16";
                        readonly name: "methods";
                        readonly type: "uint16";
                    }, {
                        readonly internalType: "bytes32[]";
                        readonly name: "origins";
                        readonly type: "bytes32[]";
                    }, {
                        readonly internalType: "enum CORSPreset";
                        readonly name: "preset";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "string";
                        readonly name: "custom";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct CORSPolicy";
                    readonly name: "cors";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "uint16";
                        readonly name: "code";
                        readonly type: "uint16";
                    }, {
                        readonly internalType: "string";
                        readonly name: "location";
                        readonly type: "string";
                    }];
                    readonly internalType: "struct Redirect";
                    readonly name: "redirect";
                    readonly type: "tuple";
                }];
                readonly internalType: "struct HeaderInfo";
                readonly name: "headerInfo";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "bytes2";
                        readonly name: "mimeType";
                        readonly type: "bytes2";
                    }, {
                        readonly internalType: "bytes2";
                        readonly name: "charset";
                        readonly type: "bytes2";
                    }, {
                        readonly internalType: "bytes2";
                        readonly name: "encoding";
                        readonly type: "bytes2";
                    }, {
                        readonly internalType: "bytes2";
                        readonly name: "language";
                        readonly type: "bytes2";
                    }];
                    readonly internalType: "struct ResourceProperties";
                    readonly name: "properties";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "size";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "version";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "lastModified";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "header";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct ResourceMetadata";
                readonly name: "metadata";
                readonly type: "tuple";
            }, {
                readonly internalType: "bytes32";
                readonly name: "etag";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct HEADResponse";
            readonly name: "head";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_path";
            readonly type: "string";
        }];
        readonly name: "OPTIONS";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint16";
                readonly name: "status";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint16";
                readonly name: "allow";
                readonly type: "uint16";
            }];
            readonly internalType: "struct OPTIONSResponse";
            readonly name: "optionsResponse";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "string";
                    readonly name: "path";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "ifModifiedSince";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "ifNoneMatch";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADRequest";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "chunkIndex";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "publisher";
                    readonly type: "address";
                }];
                readonly internalType: "struct DataRegistration[]";
                readonly name: "data";
                readonly type: "tuple[]";
            }];
            readonly internalType: "struct PATCHRequest";
            readonly name: "patchRequest";
            readonly type: "tuple";
        }];
        readonly name: "PATCH";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint16";
                    readonly name: "status";
                    readonly type: "uint16";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bool";
                            readonly name: "immutableFlag";
                            readonly type: "bool";
                        }, {
                            readonly internalType: "enum CachePreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CacheControl";
                        readonly name: "cache";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "methods";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "bytes32[]";
                            readonly name: "origins";
                            readonly type: "bytes32[]";
                        }, {
                            readonly internalType: "enum CORSPreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CORSPolicy";
                        readonly name: "cors";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "code";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "string";
                            readonly name: "location";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct Redirect";
                        readonly name: "redirect";
                        readonly type: "tuple";
                    }];
                    readonly internalType: "struct HeaderInfo";
                    readonly name: "headerInfo";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bytes2";
                            readonly name: "mimeType";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "charset";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "encoding";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "language";
                            readonly type: "bytes2";
                        }];
                        readonly internalType: "struct ResourceProperties";
                        readonly name: "properties";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "size";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "version";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "lastModified";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "header";
                        readonly type: "bytes32";
                    }];
                    readonly internalType: "struct ResourceMetadata";
                    readonly name: "metadata";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "etag";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADResponse";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "dataPoints";
                    readonly type: "bytes32[]";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "totalChunks";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct ResourceResponse";
                readonly name: "resource";
                readonly type: "tuple";
            }];
            readonly internalType: "struct LOCATEResponse";
            readonly name: "patchResponse";
            readonly type: "tuple";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "string";
                    readonly name: "path";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "ifModifiedSince";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "ifNoneMatch";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADRequest";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "bytes2";
                    readonly name: "mimeType";
                    readonly type: "bytes2";
                }, {
                    readonly internalType: "bytes2";
                    readonly name: "charset";
                    readonly type: "bytes2";
                }, {
                    readonly internalType: "bytes2";
                    readonly name: "encoding";
                    readonly type: "bytes2";
                }, {
                    readonly internalType: "bytes2";
                    readonly name: "language";
                    readonly type: "bytes2";
                }];
                readonly internalType: "struct ResourceProperties";
                readonly name: "properties";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "chunkIndex";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "publisher";
                    readonly type: "address";
                }];
                readonly internalType: "struct DataRegistration[]";
                readonly name: "data";
                readonly type: "tuple[]";
            }];
            readonly internalType: "struct PUTRequest";
            readonly name: "putRequest";
            readonly type: "tuple";
        }];
        readonly name: "PUT";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint16";
                    readonly name: "status";
                    readonly type: "uint16";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bool";
                            readonly name: "immutableFlag";
                            readonly type: "bool";
                        }, {
                            readonly internalType: "enum CachePreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CacheControl";
                        readonly name: "cache";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "methods";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "bytes32[]";
                            readonly name: "origins";
                            readonly type: "bytes32[]";
                        }, {
                            readonly internalType: "enum CORSPreset";
                            readonly name: "preset";
                            readonly type: "uint8";
                        }, {
                            readonly internalType: "string";
                            readonly name: "custom";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct CORSPolicy";
                        readonly name: "cors";
                        readonly type: "tuple";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint16";
                            readonly name: "code";
                            readonly type: "uint16";
                        }, {
                            readonly internalType: "string";
                            readonly name: "location";
                            readonly type: "string";
                        }];
                        readonly internalType: "struct Redirect";
                        readonly name: "redirect";
                        readonly type: "tuple";
                    }];
                    readonly internalType: "struct HeaderInfo";
                    readonly name: "headerInfo";
                    readonly type: "tuple";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "bytes2";
                            readonly name: "mimeType";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "charset";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "encoding";
                            readonly type: "bytes2";
                        }, {
                            readonly internalType: "bytes2";
                            readonly name: "language";
                            readonly type: "bytes2";
                        }];
                        readonly internalType: "struct ResourceProperties";
                        readonly name: "properties";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "size";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "version";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "lastModified";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "header";
                        readonly type: "bytes32";
                    }];
                    readonly internalType: "struct ResourceMetadata";
                    readonly name: "metadata";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "etag";
                    readonly type: "bytes32";
                }];
                readonly internalType: "struct HEADResponse";
                readonly name: "head";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "dataPoints";
                    readonly type: "bytes32[]";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "totalChunks";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct ResourceResponse";
                readonly name: "resource";
                readonly type: "tuple";
            }];
            readonly internalType: "struct LOCATEResponse";
            readonly name: "putResponse";
            readonly type: "tuple";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_newSiteAdmin";
            readonly type: "bytes32";
        }];
        readonly name: "changeSiteAdmin";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_role";
            readonly type: "bytes32";
        }];
        readonly name: "createResourceRole";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }];
        readonly name: "getRoleAdmin";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getSiteAdminRole";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "grantRole";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "hasRole";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "callerConfirmation";
            readonly type: "address";
        }];
        readonly name: "renounceRole";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "role";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "revokeRole";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IBaseWTTPSiteInterface;
    static connect(address: string, runner?: ContractRunner | null): IBaseWTTPSite;
}
//# sourceMappingURL=IBaseWTTPSite__factory.d.ts.map