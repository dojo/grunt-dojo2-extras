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
    var publish;
    var gitCommitStub;
    registerSuite('commands/publish', {
        before: function () {
            gitCommitStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            publish = loadModule_1.default(require, '../../../../src/commands/publish', {
                '../util/environment': {
                    gitCommit: gitCommitStub
                }
            });
        },
        afterEach: function () {
            gitCommitStub.reset();
        },
        tests: {
            'publish': {
                'publishMode is a function that returns "skip"': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var opts;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    opts = {
                                        branch: 'master',
                                        publishMode: sinon_1.stub().returns('skip'),
                                        repo: {
                                            areFilesChanged: sinon_1.stub()
                                        }
                                    };
                                    return [4, publish(opts)];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(opts.publishMode.calledOnce);
                                    assert.isTrue(opts.repo.areFilesChanged.notCalled);
                                    return [2];
                            }
                        });
                    });
                },
                'publishMode is a string': (function () {
                    var opts;
                    return {
                        beforeEach: function () {
                            opts = {
                                branch: 'master',
                                publishMode: 'commit',
                                repo: {
                                    add: sinon_1.stub().returns(Promise.resolve()),
                                    areFilesChanged: sinon_1.stub().returns(Promise.resolve(true)),
                                    commit: sinon_1.stub().returns(Promise.resolve()),
                                    ensureConfig: sinon_1.stub().returns(Promise.resolve()),
                                    getConfig: sinon_1.stub().returns(Promise.resolve('username')),
                                    push: sinon_1.stub().returns(Promise.resolve())
                                }
                            };
                        },
                        tests: {
                            'repo has no changes': function () {
                                return tslib_1.__awaiter(this, void 0, void 0, function () {
                                    var areFilesChanged;
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                areFilesChanged = opts.repo.areFilesChanged;
                                                areFilesChanged.returns(Promise.resolve(false));
                                                return [4, publish(opts)];
                                            case 1:
                                                _a.sent();
                                                assert.isTrue(areFilesChanged.calledOnce);
                                                assert.isTrue(opts.repo.ensureConfig.notCalled);
                                                return [2];
                                        }
                                    });
                                });
                            },
                            'publishMode is "commit"; gitCommit returns a value; repo is published': function () {
                                return tslib_1.__awaiter(this, void 0, void 0, function () {
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                gitCommitStub.returns('a35de344');
                                                return [4, publish(opts)];
                                            case 1:
                                                _a.sent();
                                                assert.isTrue(opts.repo.ensureConfig.calledOnce);
                                                assert.isTrue(opts.repo.add.calledOnce);
                                                assert.isTrue(opts.repo.commit.calledOnce);
                                                assert.isTrue(opts.repo.commit.calledWith('Published by username from commit a35de344'));
                                                assert.isTrue(opts.repo.push.notCalled);
                                                return [2];
                                        }
                                    });
                                });
                            },
                            'publishMode is "commit"; gitCommit returns falsy': function () {
                                return tslib_1.__awaiter(this, void 0, void 0, function () {
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                gitCommitStub.returns(undefined);
                                                return [4, publish(opts)];
                                            case 1:
                                                _a.sent();
                                                assert.isTrue(opts.repo.commit.calledWith('Published by username'));
                                                return [2];
                                        }
                                    });
                                });
                            },
                            'publishMode is "publish"': function () {
                                return tslib_1.__awaiter(this, void 0, void 0, function () {
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                opts.publishMode = 'publish';
                                                return [4, publish(opts)];
                                            case 1:
                                                _a.sent();
                                                assert.isTrue(opts.repo.push.calledOnce);
                                                return [2];
                                        }
                                    });
                                });
                            }
                        }
                    };
                })()
            }
        }
    });
});
//# sourceMappingURL=publish.js.map