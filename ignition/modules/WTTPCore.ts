// This module deploys a WTTP site using Hardhat Ignition
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WTTPCoreModule = buildModule("WTTPCoreModule", (m) => {
  const wttpGateway = m.contract("WTTPGateway");
  
  return { 
    wttpGateway
  };
});

export default WTTPCoreModule;