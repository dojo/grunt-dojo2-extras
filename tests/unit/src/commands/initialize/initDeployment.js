(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../../_support/loadModule", "sinon", "../../../../_support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var loadModule_1 = require("../../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var util_1 = require("../../../../_support/util");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
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
    registerSuite('commands/initialize/initDeployment', {
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
            initDeployment = loadModule_1.default(require, '../../../../../src/commands/initialize/initDeployment', {
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
        tests: {
            'initDeployment': (function () {
                function assertInitDeployment(travis, options) {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var repo;
                        return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var travis;
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
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
        }
    });
});
//# sourceMappingURL=initDeployment.js.map