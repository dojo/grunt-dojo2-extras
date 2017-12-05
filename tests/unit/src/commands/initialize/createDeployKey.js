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
    registerSuite('commands/initialize/createDeployKey', {
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            encryptedStub.pipe.returns(encryptedStub);
            encryptedStub.on.returns(encryptedStub).yields();
            createDeployKey = loadModule_1.default(require, '../../../../../src/commands/initialize/createDeployKey', {
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
        tests: {
            'createDeployKey': (function () {
                return {
                    'with explicit arguments passed in': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
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
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var key;
                        return tslib_1.__generator(this, function (_a) {
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
        }
    });
});
//# sourceMappingURL=createDeployKey.js.map