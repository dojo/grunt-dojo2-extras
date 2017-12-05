(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "../../log", "../../util/crypto", "../../util/environment", "../../util/streams"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var fs_1 = require("fs");
    var log_1 = require("../../log");
    var crypto_1 = require("../../util/crypto");
    var env = require("../../util/environment");
    var streams_1 = require("../../util/streams");
    function initDeployKey(deployKeyFile) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (fs_1.existsSync(deployKeyFile)) {
                            throw new Error('Deploy key already exists');
                        }
                        return [4, crypto_1.createKey(deployKeyFile)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    }
    function encryptDeployKey(privateKey, encryptedKeyFile) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var enc;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enc = crypto_1.encryptData(fs_1.createReadStream(privateKey));
                        return [4, new Promise(function (resolve) {
                                enc.encrypted.pipe(fs_1.createWriteStream(encryptedKeyFile))
                                    .on('close', function () {
                                    resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2, enc];
                }
            });
        });
    }
    function createDeployKey(deployKeyFile, encryptedKeyFile) {
        if (deployKeyFile === void 0) { deployKeyFile = env.keyFile(); }
        if (encryptedKeyFile === void 0) { encryptedKeyFile = env.encryptedKeyFile(deployKeyFile); }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys, enc;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.logger.info('Creating a deployment key');
                        return [4, initDeployKey(deployKeyFile)];
                    case 1:
                        keys = _a.sent();
                        log_1.logger.info('Encrypting deployment key');
                        return [4, encryptDeployKey(keys.privateKey, encryptedKeyFile)];
                    case 2:
                        enc = _a.sent();
                        log_1.logger.info("Confirm decrypt deploy key");
                        return [4, streams_1.equal(crypto_1.decryptData(fs_1.createReadStream(encryptedKeyFile), enc.key, enc.iv), fs_1.createReadStream(keys.privateKey))];
                    case 3:
                        _a.sent();
                        return [2, {
                                privateKey: keys.privateKey,
                                publicKey: keys.publicKey,
                                encryptedKey: enc
                            }];
                }
            });
        });
    }
    exports.default = createDeployKey;
});
//# sourceMappingURL=createDeployKey.js.map