(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../_support/loadModule", "sinon", "../../../_support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var util_1 = require("../../../_support/util");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var decryptDeployKey;
    var decryptDataObj = {
        on: sinon_1.stub(),
        pipe: sinon_1.stub()
    };
    var decryptDataStub = sinon_1.stub();
    var encryptedKeyFileStub = sinon_1.stub();
    var keyFileStub = sinon_1.stub();
    var existsSyncStub = sinon_1.stub();
    var createWriteStreamStub = sinon_1.stub();
    var createReadStreamStub = sinon_1.stub();
    registerSuite('commands/decryptDeployKey', {
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            decryptDataObj.on.returns(decryptDataObj);
            decryptDataObj.pipe.returns(decryptDataObj);
            decryptDeployKey = loadModule_1.default(require, '../../../../src/commands/decryptDeployKey', {
                '../util/crypto': {
                    decryptData: decryptDataStub.returns(decryptDataObj)
                },
                '../util/environment': {
                    decryptKeyName: 'decryptKeyName',
                    decryptIvName: 'decryptIvName',
                    encryptedKeyFile: encryptedKeyFileStub.returns('encryptedKeyFile'),
                    keyFile: keyFileStub.returns('keyFile')
                },
                'fs': {
                    existsSync: existsSyncStub,
                    createWriteStream: createWriteStreamStub.returns('writeStream'),
                    createReadStream: createReadStreamStub.returns('readStream')
                }
            });
        },
        afterEach: function () {
            decryptDataStub.reset();
            encryptedKeyFileStub.reset();
            keyFileStub.reset();
            existsSyncStub.reset();
            createWriteStreamStub.reset();
            createReadStreamStub.reset();
            decryptDataObj.on.reset();
            decryptDataObj.pipe.reset();
        },
        tests: {
            'decryptDeployKey': (function () {
                function ensureDecryptionResolves() {
                    existsSyncStub.onCall(0).returns(true);
                    existsSyncStub.onCall(1).returns(false);
                    decryptDataObj.on.withArgs('close').yields();
                }
                function assertDecryptDeployKey(encryptedFile, key, iv, decryptedFile) {
                    process.env.decryptKeyName = 'decryptKeyName';
                    process.env.decryptIvName = 'decryptIvName';
                    var promise = decryptDeployKey(encryptedFile, key, iv, decryptedFile);
                    assert.instanceOf(promise, Promise);
                    return promise;
                }
                return {
                    'arguments passed in explicitly': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var deployKeyDecrypted;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        ensureDecryptionResolves();
                                        return [4, assertDecryptDeployKey('encrypted.file', 'decrypt key', 'decrypt iv', 'decrypted.file')];
                                    case 1:
                                        deployKeyDecrypted = _a.sent();
                                        assert.isTrue(encryptedKeyFileStub.notCalled);
                                        assert.isTrue(keyFileStub.notCalled);
                                        assert.isTrue(createReadStreamStub.calledOnce);
                                        assert.isTrue(createWriteStreamStub.calledOnce);
                                        assert.isTrue(decryptDataStub.calledOnce);
                                        assert.isTrue(decryptDataStub.calledWith('readStream', 'decrypt key', 'decrypt iv'));
                                        assert.isTrue(deployKeyDecrypted);
                                        return [2];
                                }
                            });
                        });
                    },
                    'arguments obtained from default': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var deployKeyDecrypted;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        ensureDecryptionResolves();
                                        return [4, assertDecryptDeployKey()];
                                    case 1:
                                        deployKeyDecrypted = _a.sent();
                                        assert.isTrue(deployKeyDecrypted);
                                        assert.isTrue(existsSyncStub.calledTwice);
                                        return [2];
                                }
                            });
                        });
                    },
                    'nonexistent files and falsy arguments; eventually returns false': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var _a, _b;
                            return tslib_1.__generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        existsSyncStub.returns(false);
                                        _b = (_a = assert).isFalse;
                                        return [4, assertDecryptDeployKey()];
                                    case 1:
                                        _b.apply(_a, [_c.sent()]);
                                        return [2];
                                }
                            });
                        });
                    },
                    'decryption eventually rejects': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                existsSyncStub.onCall(0).returns(true);
                                existsSyncStub.onCall(1).returns(false);
                                decryptDataObj.on.withArgs('error').yields(new Error('error'));
                                return [2, assertDecryptDeployKey().then(util_1.throwWithError('Should reject when necessary files don\'t exist'), function (err) {
                                        assert.strictEqual(err.message, 'error');
                                    })];
                            });
                        });
                    }
                };
            })()
        }
    });
});
//# sourceMappingURL=decryptDeployKey.js.map