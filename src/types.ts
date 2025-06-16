/**
 * WTTP Gateway Types and Interfaces
 * 
 * Re-exports typechain-generated types for the WTTP Gateway contract
 */

// Export WTTPGateway contract types
export {
  WTTPGateway,
} from '../typechain-types/contracts/WTTPGateway';

// Export factory types
export {
  WTTPGateway__factory
} from '../typechain-types/factories/contracts/WTTPGateway__factory';

// Re-export common types that might be useful
export type {
  HEADRequestStruct,
  HEADRequestStructOutput,
  HEADResponseStruct,
  HEADResponseStructOutput,
  OPTIONSResponseStruct,
  OPTIONSResponseStructOutput,
  GETRequestStruct,
  GETRequestStructOutput,
  GETResponseStruct,
  GETResponseStructOutput,
  LOCATERequestStruct,
  LOCATERequestStructOutput,
  LOCATEResponseStruct,
  LOCATEResponseStructOutput
} from '../typechain-types/contracts/WTTPGateway';