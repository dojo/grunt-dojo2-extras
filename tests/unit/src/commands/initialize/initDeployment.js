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
    var initDeployment;
    var githubAuthStub = sinon_1.stub();
    var keyFileStub = sinon_1.stub();
    var encryptedKeyFileStub = sinon_1.stub();
    var createDeployKeyStub = sinon_1.stub();
    var findStub = sinon_1.stub();
    var existsSyncStub = sinon_1.stub();
    var readFileSyncStub = sinon_1.stub();
    var isAuthorizedStub = sinon_1.stub();
    var travisCreateAuthorizationStub = sinon_1.stub();
    var travisDeleteAuthorizationStub = sinon_1.stub();
    var fetchRepositoryStub = sinon_1.stub();
    var listEnvironmentVariablesStub = sinon_1.stub();
    var setEnvironmentVariablesStub = sinon_1.stub();
    var createKeyStub = sinon_1.stub();
    var deleteKeyStub = sinon_1.stub();
    var Travis = (function () {
        function class_1() {
            this.isAuthorized = isAuthorizedStub;
            this.createAuthorization = travisCreateAuthorizationStub;
            this.deleteAuthorization = travisDeleteAuthorizationStub;
            this.fetchRepository = fetchRepositoryStub;
        }
        return class_1;
    }());
    var GitHub = (function () {
        function class_2() {
            this.createKey = createKeyStub;
            this.deleteKey = deleteKeyStub;
        }
        class_2.prototype.toString = function () {
            return 'repo';
        };
        return class_2;
    }());
    var TravisSpy = sinon_1.spy(Travis);
    registerSuite({
        name: 'commands/initialize/initDeployment',
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            isAuthorizedStub.returns(true);
            keyFileStub.returns('keyFile');
            encryptedKeyFileStub.returns('encryptedKeyFile');
            existsSyncStub.returns(true);
            fetchRepositoryStub.resolves({
                listEnvironmentVariables: listEnvironmentVariablesStub,
                setEnvironmentVariables: setEnvironmentVariablesStub
            });
            listEnvironmentVariablesStub.resolves([
                { name: 'decryptKey', value: 'decryptKey', isPublic: false },
                { name: 'decryptIv', value: 'decryptIv', isPublic: false }
            ]);
            createDeployKeyStub.returns({
                publicKey: 'publicKey',
                privateKey: 'privateKey',
                encryptedKey: {
                    key: 'encryptedKey',
                    iv: 'encryptedIv'
                }
            });
            initDeployment = loadModule_1.default('src/commands/initialize/initDeployment', {
                '../../util/Travis': { default: TravisSpy },
                '../../util/environment': {
                    decryptKeyName: 'decryptKey',
                    decryptIvName: 'decryptIv',
                    githubAuth: githubAuthStub,
                    keyFile: keyFileStub,
                    encryptedKeyFile: encryptedKeyFileStub
                },
                './createDeployKey': { default: createDeployKeyStub },
                '@dojo/shim/array': {
                    find: findStub
                },
                'fs': {
                    existsSync: existsSyncStub,
                    readFileSync: readFileSyncStub
                }
            });
        },
        afterEach: function () {
            TravisSpy.reset();
            githubAuthStub.reset();
            keyFileStub.reset();
            encryptedKeyFileStub.reset();
            createDeployKeyStub.reset();
            findStub.reset();
            existsSyncStub.reset();
            readFileSyncStub.reset();
            isAuthorizedStub.reset();
            travisCreateAuthorizationStub.reset();
            travisDeleteAuthorizationStub.reset();
            fetchRepositoryStub.reset();
            listEnvironmentVariablesStub.reset();
            setEnvironmentVariablesStub.reset();
            createKeyStub.reset();
            deleteKeyStub.reset();
        },
        'initDeployment': (function () {
            function assertInitDeployment(travis, options) {
                return __awaiter(this, void 0, void 0, function () {
                    var repo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                repo = new GitHub();
                                return [4, initDeployment(repo, travis, options)];
                            case 1:
                                _a.sent();
                                assert.isTrue(isAuthorizedStub.calledOnce);
                                assert.isTrue(fetchRepositoryStub.calledOnce);
                                assert.isTrue(travisDeleteAuthorizationStub.calledOnce);
                                return [2];
                        }
                    });
                });
            }
            return {
                'explicit Travis instance and options': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var travis;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    travis = new Travis();
                                    return [4, assertInitDeployment(travis, {
                                            deployKeyFile: 'deploy-key.file',
                                            encryptedKeyFile: 'deploy-key.enc'
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    });
                },
                'default instance and options; Travis is not authorized, should not create deploy key': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    isAuthorizedStub.returns(false);
                                    travisCreateAuthorizationStub.resolves(true);
                                    return [4, assertInitDeployment()];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(TravisSpy.calledOnce);
                                    assert.isTrue(keyFileStub.calledOnce);
                                    assert.isTrue(encryptedKeyFileStub.calledOnce);
                                    assert.isTrue(travisCreateAuthorizationStub.calledOnce);
                                    assert.isTrue(listEnvironmentVariablesStub.calledOnce);
                                    assert.isTrue(existsSyncStub.calledOnce);
                                    assert.isTrue(createDeployKeyStub.notCalled);
                                    assert.isTrue(createKeyStub.notCalled);
                                    assert.isTrue(setEnvironmentVariablesStub.notCalled);
                                    assert.isTrue(findStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'should create deploy key': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    listEnvironmentVariablesStub.resolves([]);
                                    isAuthorizedStub.returns(false);
                                    existsSyncStub.returns(false);
                                    return [4, assertInitDeployment()];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(createDeployKeyStub.calledOnce);
                                    assert.isTrue(readFileSyncStub.calledOnce);
                                    assert.isTrue(createKeyStub.calledOnce);
                                    assert.isTrue(setEnvironmentVariablesStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'has no ssh key so will not call `deleteKey`; eventually throws': function () {
                    var message = 'error: cannot create key';
                    createKeyStub.rejects({ message: message });
                    existsSyncStub.returns(false);
                    listEnvironmentVariablesStub.resolves([]);
                    return assertInitDeployment().then(util_1.throwWithError('Should throw when no ssh key can be created'), function (e) {
                        assert.isTrue(deleteKeyStub.notCalled);
                        assert.strictEqual(message, e.message);
                    });
                },
                'has deploy key environment variable; calls `deleteKey`; eventually throws': function () {
                    var message = 'error: cannot set env vars';
                    setEnvironmentVariablesStub.rejects({ message: message });
                    existsSyncStub.returns(false);
                    listEnvironmentVariablesStub.resolves([]);
                    createKeyStub.resolves(true);
                    return assertInitDeployment().then(util_1.throwWithError('Should throw when environment variables cannot be set'), function (e) {
                        assert.isTrue(deleteKeyStub.calledOnce);
                        assert.strictEqual(message, e.message);
                    });
                }
            };
        })()
    });
});
//# sourceMappingURL=initDeployment.js.map