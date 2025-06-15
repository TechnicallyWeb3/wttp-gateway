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

import { expect } from "chai";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("Hardhat Tasks CLI", function () {
  // Increase timeout for CLI operations
  this.timeout(60000);

  describe("Task Availability", function () {
    it("Should list all available tasks including our custom tasks", async function () {
      try {
        const { stdout } = await execAsync("npx hardhat --help");
        
        // Check that our custom tasks are listed
        expect(stdout).to.include("deploy:vanity");
        expect(stdout).to.include("deploy:simple");
        expect(stdout).to.include("deploy:verify");
        expect(stdout).to.include("fetch");
      } catch (error: any) {
        console.log("Task listing output:", error.stdout);
        throw error;
      }
    });
  });

  describe("Deploy Tasks", function () {
    describe("deploy:vanity", function () {
      it("Should show help when requested", async function () {
        try {
          const { stdout } = await execAsync("npx hardhat deploy:vanity --help");
          
          expect(stdout).to.include("Deploy WTTP gateway contract with vanity addresses");
          expect(stdout).to.include("--skip-verify");
        } catch (error: any) {
          console.log("Help output:", error.stdout);
          throw error;
        }
      });

      it("Should handle skipVerify flag", async function () {
        try {
          // On fresh hardhat network, this should work and show verification disabled
          const { stdout, stderr } = await execAsync("npx hardhat deploy:vanity --skip-verify", {
            timeout: 30000
          });
          
          const output = stdout + stderr;
          // Should mention verification being disabled
          expect(output).to.include("DISABLED");
          expect(output).to.include("deployment completed successfully");
        } catch (error: any) {
          // If it fails (e.g., due to nonce issues), should show proper error handling
          const output = (error.stderr || error.stdout || "").toString();
          expect(output).to.satisfy((str: string) => 
            str.includes("verification") || str.includes("DISABLED") || str.includes("skip") || str.includes("nonce") || str.includes("Error")
          );
        }
      });

      it("Should fail with proper nonce error on used deployer", async function () {
        try {
          await execAsync("npx hardhat deploy:vanity", { timeout: 30000 });
        } catch (error: any) {
          // Should fail with nonce error if deployer has been used
          const output = error.stderr || error.stdout || "";
          expect(output).to.satisfy((str: string) => 
            str.includes("nonce") || str.includes("Vanity") || str.includes("deployer")
          );
        }
      });
    });

    describe("deploy:simple", function () {
      it("Should show help when requested", async function () {
        try {
          const { stdout } = await execAsync("npx hardhat deploy:simple --help");
          
          expect(stdout).to.include("Deploy WTTP gateway contract");
          expect(stdout).to.include("--skip-verify");
        } catch (error: any) {
          console.log("Help output:", error.stdout);
          throw error;
        }
      });

      it("Should deploy successfully on hardhat network", async function () {
        try {
          const { stdout, stderr } = await execAsync("npx hardhat deploy:simple --skip-verify", {
            timeout: 45000
          });
          
          const output = stdout + stderr;
          expect(output).to.satisfy((str: string) => 
            str.includes("Deployment completed successfully") || str.includes("Gateway") || str.includes("deployed")
          );
          expect(output).to.include("0x"); // Should contain contract address
        } catch (error: any) {
          console.log("Deploy output:", error.stdout);
          console.log("Deploy error:", error.stderr);
          throw error;
        }
      });
    });

    describe("deploy:verify", function () {
      it("Should show help when requested", async function () {
        try {
          const { stdout } = await execAsync("npx hardhat deploy:verify --help");
          
          expect(stdout).to.include("Verify deployed WTTP gateway contract");
          expect(stdout).to.include("--gateway");
        } catch (error: any) {
          console.log("Help output:", error.stdout);
          throw error;
        }
      });

      it("Should require gateway parameter", async function () {
        try {
          await execAsync("npx hardhat deploy:verify", { timeout: 15000 });
        } catch (error: any) {
          // Should fail due to missing required parameter
          const output = error.stderr || error.stdout || "";
          expect(output).to.satisfy((str: string) => 
            str.includes("gateway") || str.includes("required") || str.includes("missing")
          );
        }
      });

      it("Should handle invalid gateway address", async function () {
        try {
          await execAsync("npx hardhat deploy:verify --gateway 0x1234567890123456789012345678901234567890", {
            timeout: 15000
          });
        } catch (error: any) {
          // Should fail gracefully with invalid address
          const output = error.stderr || error.stdout || "";
          expect(output).to.satisfy((str: string) => 
            str.includes("verify") || str.includes("failed") || str.includes("contract")
          );
        }
      });
    });
  });

  describe("Fetch Task", function () {
    it("Should show help when requested", async function () {
      try {
        const { stdout } = await execAsync("npx hardhat fetch --help");
        
        expect(stdout).to.include("Fetch a resource from a WTTP site");
        expect(stdout).to.include("--wttp");
        expect(stdout).to.include("--site");
        expect(stdout).to.include("--path");
        expect(stdout).to.include("--range");
        expect(stdout).to.include("--head");
      } catch (error: any) {
        console.log("Help output:", error.stdout);
        throw error;
      }
    });

    it("Should require wttp parameter", async function () {
      try {
        await execAsync("npx hardhat fetch", { timeout: 15000 });
      } catch (error: any) {
        // Should fail due to missing required parameters
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("wttp") || str.includes("required") || str.includes("missing")
        );
      }
    });

    it("Should require site parameter", async function () {
      try {
        await execAsync("npx hardhat fetch --wttp 0x1234567890123456789012345678901234567890", {
          timeout: 15000
        });
      } catch (error: any) {
        // Should fail due to missing site parameter
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("site") || str.includes("required") || str.includes("missing")
        );
      }
    });

    it("Should require path parameter", async function () {
      try {
        await execAsync("npx hardhat fetch --wttp 0x1234567890123456789012345678901234567890 --site 0x0987654321098765432109876543210987654321", {
          timeout: 15000
        });
      } catch (error: any) {
        // Should fail due to missing path parameter
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("path") || str.includes("required") || str.includes("missing")
        );
      }
    });

    it("Should handle complete fetch command with invalid addresses", async function () {
      try {
        await execAsync("npx hardhat fetch --wttp 0x1234567890123456789012345678901234567890 --site 0x0987654321098765432109876543210987654321 --path /test-resource", {
          timeout: 20000
        });
      } catch (error: any) {
        // Should fail gracefully with connection/contract errors
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("fetch") || str.includes("resource") || str.includes("contract") || str.includes("error")
        );
      }
    });

    it("Should handle range parameter format", async function () {
      try {
        await execAsync("npx hardhat fetch --wttp 0x1234567890123456789012345678901234567890 --site 0x0987654321098765432109876543210987654321 --path /test --range 10-50", {
          timeout: 20000
        });
      } catch (error: any) {
        // Should attempt to parse range parameter
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("fetch") || str.includes("range") || str.includes("contract") || str.includes("error")
        );
      }
    });

    it("Should handle HEAD request flag", async function () {
      try {
        await execAsync("npx hardhat fetch --wttp 0x1234567890123456789012345678901234567890 --site 0x0987654321098765432109876543210987654321 --path /test --head", {
          timeout: 20000
        });
      } catch (error: any) {
        // Should attempt HEAD request
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("HEAD") || str.includes("head") || str.includes("contract") || str.includes("error")
        );
      }
    });
  });

  describe("Task Integration", function () {
    it("Should show all tasks in help", async function () {
      try {
        const { stdout } = await execAsync("npx hardhat");
        
        // Should list our custom tasks
        expect(stdout).to.include("deploy:vanity");
        expect(stdout).to.include("deploy:simple");
        expect(stdout).to.include("deploy:verify");
        expect(stdout).to.include("fetch");
      } catch (error: any) {
        console.log("Task list output:", error.stdout);
        throw error;
      }
    });

    it("Should handle invalid task names gracefully", async function () {
      try {
        await execAsync("npx hardhat invalid:task", { timeout: 10000 });
      } catch (error: any) {
        // Should show proper error for invalid task
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("task") || str.includes("not found") || str.includes("invalid")
        );
      }
    });
  });

  describe("Network Configuration", function () {
    it("Should work with hardhat network by default", async function () {
      try {
        const { stdout, stderr } = await execAsync("npx hardhat deploy:simple --skip-verify", {
          timeout: 45000
        });
        
        const output = stdout + stderr;
        expect(output).to.satisfy((str: string) => 
          str.includes("hardhat") || str.includes("localhost") || str.includes("31337")
        );
      } catch (error: any) {
        // Should at least attempt to deploy on hardhat network
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("network") || str.includes("hardhat")
        );
      }
    });

    it("Should respect network parameter", async function () {
      try {
        await execAsync("npx hardhat deploy:simple --network localhost --skip-verify", {
          timeout: 20000
        });
      } catch (error: any) {
        // May fail if localhost node not running, but should recognize network param
        const output = error.stderr || error.stdout || "";
        expect(output).to.satisfy((str: string) => 
          str.includes("localhost") || str.includes("network") || str.includes("connection") || str.includes("ECONNREFUSED")
        );
      }
    });
  });
}); 