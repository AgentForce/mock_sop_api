"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nconf = require("nconf");
const path = require("path");
//Read Configurations
const configs = new nconf.Provider({
    env: true,
    argv: true,
    store: {
        type: 'file',
        file: path.join(__dirname, `./config.${process.env.NODE_ENV || 'dev'}.json`)
    }
});
function getDatabaseConfig() {
    return configs.get('database');
}
exports.getDatabaseConfig = getDatabaseConfig;
function getDatabasePgConfig() {
    return configs.get('development');
}
exports.getDatabasePgConfig = getDatabasePgConfig;
function getServerConfigs() {
    return configs.get('server');
}
exports.getServerConfigs = getServerConfigs;
function getRedisConfigs() {
    return configs.get('redis');
}
exports.getRedisConfigs = getRedisConfigs;
//# sourceMappingURL=index.js.map