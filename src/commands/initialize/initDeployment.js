(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../util/Travis", "../../util/environment", "fs", "../../log", "./createDeployKey", "@dojo/shim/array"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Travis_1 = require("../../util/Travis");
    var env = require("../../util/environment");
    var fs_1 = require("fs");
    var log_1 = require("../../log");
    var createDeployKey_1 = require("./createDeployKey");
    var array_1 = require("@dojo/shim/array");
    function shouldCreateDeployKey(envvars, encryptedKeyFile) {
        var hasKeyValue = envvars.some(function (envvar) {
            return envvar.name === env.decryptKeyName;
        });
        var hasIvValue = envvars.some(function (envvar) {
            return envvar.name === env.decryptIvName;
        });
        var hasEncryptedKeyFile = fs_1.existsSync(encryptedKeyFile);
        var result = hasKeyValue && hasIvValue && hasEncryptedKeyFile;
        if (hasKeyValue !== result || hasIvValue !== result || hasEncryptedKeyFile !== result) {
            log_1.logger.error('There is an environment mismatch between one or more decrypted key states');
            log_1.logger.error("Encrypted key file exists: " + hasEncryptedKeyFile);
            log_1.logger.error("Travis has an environment variable \"" + env.decryptKeyName + "\": " + hasKeyValue);
            log_1.logger.error("Travis has an environment variable \"" + env.decryptIvName + "\": " + hasIvValue);
            log_1.logger.error("A deploy key will not be processed. The environment setup should be investigated.");
            throw new Error('Please review your environment!');
        }
        return !result;
    }
    function displayDeployOptionSummary(envvars) {
        var deployEnvVar = array_1.find(envvars, function (envvar) {
            return envvar.name === 'DEPLOY_DOCS';
        });
        if (deployEnvVar) {
            log_1.logger.info("It looks like this repository has DEPLOY_DOCS is set to \"" + deployEnvVar.value + "\"");
        }
        if (!deployEnvVar || deployEnvVar.value !== 'publish') {
            log_1.logger.info('To begin publishing this site please add the DEPLOY_DOCS environment variable to Travis');
            log_1.logger.info('and set its value to "publish"');
        }
    }
    function initDeployment(repo, travis, options) {
        if (travis === void 0) { travis = new Travis_1.default(); }
        if (options === void 0) { options = {
            deployKeyFile: env.keyFile(),
            encryptedKeyFile: env.encryptedKeyFile()
        }; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var deployKeyFile, encryptedKeyFile, keyResponse, travisRepo, travisEnvVars, keys, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deployKeyFile = options.deployKeyFile, encryptedKeyFile = options.encryptedKeyFile;
                        keyResponse = null;
                        if (!!travis.isAuthorized()) return [3, 2];
                        log_1.logger.info('Creating a temporary authorization token in GitHub for Travis');
                        return [4, travis.createAuthorization(repo)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, 13, 15]);
                        return [4, travis.fetchRepository(repo.toString())];
                    case 3:
                        travisRepo = _a.sent();
                        return [4, travisRepo.listEnvironmentVariables()];
                    case 4:
                        travisEnvVars = _a.sent();
                        if (!shouldCreateDeployKey(travisEnvVars, encryptedKeyFile)) return [3, 8];
                        return [4, createDeployKey_1.default(deployKeyFile, encryptedKeyFile)];
                    case 5:
                        keys = _a.sent();
                        log_1.logger.info('Adding deployment key to GitHub');
                        return [4, repo.createKey(fs_1.readFileSync(keys.publicKey, { encoding: 'utf8' }))];
                    case 6:
                        keyResponse = _a.sent();
                        return [4, travisRepo.setEnvironmentVariables({ name: env.decryptKeyName, value: keys.encryptedKey.key, isPublic: false }, { name: env.decryptIvName, value: keys.encryptedKey.iv, isPublic: false })];
                    case 7:
                        _a.sent();
                        log_1.logger.info('');
                        log_1.logger.info("A new encrypted deploy key has been created at " + encryptedKeyFile + ".");
                        log_1.logger.info("Please commit this to your GitHub repository. The unencrypted keys \"" + keys.publicKey + "\"");
                        log_1.logger.info("and \"" + keys.privateKey + "\" may be deleted.");
                        log_1.logger.info("Variables to decrypt this key have been added to your Travis repository with the name");
                        log_1.logger.info("\"" + env.decryptKeyName + "\" and \"" + env.decryptIvName + "\".");
                        return [3, 9];
                    case 8:
                        log_1.logger.info("An encrypted deploy key already exists at \"" + encryptedKeyFile + "\" so a new one was not created.");
                        _a.label = 9;
                    case 9:
                        displayDeployOptionSummary(travisEnvVars);
                        return [3, 15];
                    case 10:
                        e_1 = _a.sent();
                        log_1.logger.error("There was an error " + e_1.message + ". Cleaning up...");
                        if (!keyResponse) return [3, 12];
                        return [4, repo.deleteKey(keyResponse.id)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: throw e_1;
                    case 13:
                        log_1.logger.info('Removing temporary authorization token from GitHub');
                        return [4, travis.deleteAuthorization(repo)];
                    case 14:
                        _a.sent();
                        return [7];
                    case 15: return [2];
                }
            });
        });
    }
    exports.default = initDeployment;
});
//# sourceMappingURL=initDeployment.js.map