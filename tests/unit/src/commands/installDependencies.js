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
    var installDependencies;
    var joinStub;
    var promiseExecStub;
    var existsSyncStub;
    registerSuite('commands/installDependencies', {
        before: function () {
            joinStub = sinon_1.stub();
            promiseExecStub = sinon_1.stub();
            existsSyncStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            installDependencies = loadModule_1.default(require, '../../../../src/commands/installDependencies', {
                'path': {
                    join: joinStub
                },
                '../util/process': {
                    promiseExec: promiseExecStub
                },
                'fs': {
                    existsSync: existsSyncStub
                }
            });
        },
        afterEach: function () {
            joinStub.reset();
            promiseExecStub.reset();
            existsSyncStub.reset();
        },
        tests: {
            installDependencies: (function () {
                var dir = 'dir';
                var typingsJsonDir = 'dir/typings.json';
                return {
                    'typings.json exists': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        existsSyncStub.returns(true);
                                        return [4, assertInstallDependencies(dir)];
                                    case 1:
                                        _a.sent();
                                        assert.isTrue(promiseExecStub.calledTwice);
                                        assert.strictEqual(promiseExecStub.secondCall.args[1].cwd, dir);
                                        return [2];
                                }
                            });
                        });
                    },
                    'typings.json does not exist': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        existsSyncStub.returns(false);
                                        return [4, assertInstallDependencies(dir)];
                                    case 1:
                                        _a.sent();
                                        assert.isTrue(promiseExecStub.calledOnce);
                                        return [2];
                                }
                            });
                        });
                    }
                };
                function assertInstallDependencies(dir) {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var typingsJson;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    joinStub.returns(typingsJsonDir);
                                    return [4, installDependencies(dir)];
                                case 1:
                                    typingsJson = _a.sent();
                                    assert.strictEqual(typingsJson, typingsJsonDir);
                                    assert.isTrue(joinStub.calledOnce);
                                    assert.strictEqual(joinStub.firstCall.args[0], dir);
                                    assert.strictEqual(promiseExecStub.firstCall.args[1].cwd, dir);
                                    return [2, typingsJson];
                            }
                        });
                    });
                }
            })()
        }
    });
});
//# sourceMappingURL=installDependencies.js.map