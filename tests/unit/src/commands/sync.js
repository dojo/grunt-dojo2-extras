(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../_support/loadModule", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var sync;
    var GitSpy;
    var checkoutStub;
    var isInitializedStub;
    var syncOptions = {
        branch: 'master',
        cloneDirectory: 'dir',
        url: 'http://web.site'
    };
    registerSuite('commands/sync', {
        before: function () {
            checkoutStub = sinon_1.stub();
            isInitializedStub = sinon_1.stub();
            var Git = (function () {
                function class_1() {
                    this.assert = sinon_1.stub();
                    this.checkout = checkoutStub;
                    this.clone = sinon_1.stub();
                    this.createOrphan = sinon_1.stub();
                    this.ensureConfig = sinon_1.stub();
                    this.isInitialized = isInitializedStub;
                    this.pull = sinon_1.stub();
                }
                return class_1;
            }());
            GitSpy = sinon_1.spy(Git);
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            sync = loadModule_1.default(require, '../../../../src/commands/sync', {
                '../util/Git': { default: GitSpy }
            });
        },
        afterEach: function () {
            GitSpy.reset();
            checkoutStub.reset();
            isInitializedStub.reset();
        },
        tests: {
            sync: (function () {
                return {
                    'Git initialized; checkout eventually resolves': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var git;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        checkoutStub.returns(Promise.resolve('master'));
                                        isInitializedStub.returns(true);
                                        return [4, assertSync()];
                                    case 1:
                                        _a.sent();
                                        git = GitSpy.lastCall.returnValue;
                                        assert.isTrue(git.assert.calledOnce);
                                        assert.isTrue(git.pull.calledOnce);
                                        return [2];
                                }
                            });
                        });
                    },
                    'Git not initialized; checkout eventually resolves': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var git;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        checkoutStub.returns(Promise.resolve());
                                        isInitializedStub.returns(false);
                                        return [4, assertSync()];
                                    case 1:
                                        _a.sent();
                                        git = GitSpy.lastCall.returnValue;
                                        assert.isTrue(git.clone.calledOnce);
                                        assert.isTrue(git.pull.calledOnce);
                                        return [2];
                                }
                            });
                        });
                    },
                    'Git checkout eventually rejects': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var git;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        checkoutStub.returns(Promise.reject(undefined));
                                        isInitializedStub.returns(true);
                                        return [4, assertSync()];
                                    case 1:
                                        _a.sent();
                                        git = GitSpy.lastCall.returnValue;
                                        assert.isTrue(git.createOrphan.calledOnce);
                                        return [2];
                                }
                            });
                        });
                    }
                };
                function assertSync() {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var git;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, sync(syncOptions)];
                                case 1:
                                    _a.sent();
                                    git = GitSpy.lastCall.returnValue;
                                    assert.isTrue(GitSpy.calledOnce);
                                    assert.isTrue(git.ensureConfig.calledOnce);
                                    assert.isTrue(git.isInitialized.calledOnce);
                                    assert.isTrue(git.checkout.calledOnce);
                                    return [2];
                            }
                        });
                    });
                }
            })()
        }
    });
});
//# sourceMappingURL=sync.js.map