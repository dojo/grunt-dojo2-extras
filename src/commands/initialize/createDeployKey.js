var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "../../log", "../../util/crypto", "../../util/environment", "../../util/streams"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs_1 = require("fs");
    var log_1 = require("../../log");
    var crypto_1 = require("../../util/crypto");
    var env = require("../../util/environment");
    var streams_1 = require("../../util/streams");
    function initDeployKey(deployKeyFile) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var enc;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var keys, enc;
            return __generator(this, function (_a) {
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