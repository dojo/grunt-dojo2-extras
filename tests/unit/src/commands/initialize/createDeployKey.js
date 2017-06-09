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
        define(["require", "exports", "intern!object", "intern/chai!assert", "../../../../_support/loadModule", "sinon", "../../../../_support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var loadModule_1 = require("../../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var util_1 = require("../../../../_support/util");
    var createDeployKey;
    var encryptedStub = {
        pipe: sinon_1.stub(),
        on: sinon_1.stub()
    };
    var keyFileStub = sinon_1.stub();
    var encryptedKeyFileStub = sinon_1.stub();
    var existsSyncStub = sinon_1.stub();
    var createReadStreamStub = sinon_1.stub();
    var createWriteStreamStub = sinon_1.stub();
    var createKeyStub = sinon_1.stub();
    var encryptDataStub = sinon_1.stub();
    var decryptDataStub = sinon_1.stub();
    var equalStub = sinon_1.stub();
    registerSuite({
        name: 'commands/initialize/createDeployKey',
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            encryptedStub.pipe.returns(encryptedStub);
            encryptedStub.on.returns(encryptedStub).yields();
            createDeployKey = loadModule_1.default('src/commands/initialize/createDeployKey', {
                '../../util/environment': {
                    keyFile: keyFileStub.returns('keyFileStub'),
                    encryptedKeyFile: encryptedKeyFileStub.returns('encryptedKeyFileStub')
                },
                'fs': {
                    existsSync: existsSyncStub,
                    createReadStream: createReadStreamStub,
                    createWriteStream: createWriteStreamStub
                },
                '../../util/crypto': {
                    createKey: createKeyStub.returns(Promise.resolve({
                        privateKey: 'privateKey',
                        publicKey: 'publicKey'
                    })),
                    encryptData: encryptDataStub.returns({
                        key: 'encrypt data key',
                        iv: 'encrypt data iv',
                        encrypted: encryptedStub
                    }),
                    decryptData: decryptDataStub
                },
                '../../util/streams': {
                    equal: equalStub.returns(Promise.resolve())
                }
            });
        },
        afterEach: function () {
            keyFileStub.reset();
            encryptedKeyFileStub.reset();
            existsSyncStub.reset();
            createReadStreamStub.reset();
            createWriteStreamStub.reset();
            createKeyStub.reset();
            encryptDataStub.reset();
            decryptDataStub.reset();
            equalStub.reset();
        },
        'createDeployKey': (function () {
            return {
                'with explicit arguments passed in': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, assertDeployKey('deploykey.file', 'deploykey.enc')];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    });
                },
                'with default options': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, assertDeployKey()];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(keyFileStub.calledOnce);
                                    assert.isTrue(encryptedKeyFileStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'Deploy key already exists': function () {
                    existsSyncStub.returns(true);
                    var promise = createDeployKey('deploykey.file', 'deploykey.enc');
                    return promise.then(util_1.throwWithError('Should reject when deploy key already exists'), function (err) {
                        assert.strictEqual(err.message, 'Deploy key already exists');
                        assert.isTrue(existsSyncStub.calledOnce);
                    });
                }
            };
            function assertDeployKey(deployKeyFile, encryptedKeyFile) {
                return __awaiter(this, void 0, void 0, function () {
                    var key;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, createDeployKey(deployKeyFile, encryptedKeyFile)];
                            case 1:
                                key = _a.sent();
                                assert.isTrue(createKeyStub.calledOnce);
                                assert.isTrue(encryptDataStub.calledOnce);
                                assert.isTrue(createReadStreamStub.calledThrice);
                                assert.isTrue(createWriteStreamStub.calledOnce);
                                assert.isTrue(equalStub.calledOnce);
                                return [2, key];
                        }
                    });
                });
            }
        })()
    });
});
//# sourceMappingURL=createDeployKey.js.map