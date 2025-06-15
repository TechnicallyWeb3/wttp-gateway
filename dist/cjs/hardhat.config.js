"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
// Import tasks
require("./tasks/deploy");
require("./tasks/fetch");
const config = {
    solidity: "0.8.28",
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map