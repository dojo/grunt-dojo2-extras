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
    var initAuthorization;
    var isAuthorizedStub = sinon_1.stub();
    var travisCreateAuthorizationStub = sinon_1.stub();
    var travisDeleteAuthorizationStub = sinon_1.stub();
    var listEnvironmentVariablesStub = sinon_1.stub();
    var setEnvironmentVariablesStub = sinon_1.stub();
    var fetchRepositoryStub = sinon_1.stub();
    var authenticateStub = sinon_1.stub();
    var getRateLimitStub = sinon_1.stub();
    var toStringStub = sinon_1.stub();
    var repoCreateAuthorizationStub = sinon_1.stub();
    var repoDeleteAuthorizationStub = sinon_1.stub();
    var findStub = sinon_1.stub();
    var githubAuthStub = sinon_1.stub();
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
            this.owner = 'dojo';
            this.name = 'grunt-dojo2-extras';
            this.api = {
                authenticate: authenticateStub,
                misc: {
                    getRateLimit: getRateLimitStub
                }
            };
            this.toString = toStringStub;
            this.createAuthorization = repoCreateAuthorizationStub;
            this.deleteAuthorization = repoDeleteAuthorizationStub;
        }
        return class_2;
    }());
    var TravisSpy = sinon_1.spy(Travis);
    var GitHubSpy = sinon_1.spy(GitHub);
    registerSuite('commands/initialize/initAuthorization', {
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            travisCreateAuthorizationStub.returns(Promise.resolve());
            travisDeleteAuthorizationStub.returns(Promise.resolve());
            fetchRepositoryStub.returns(Promise.resolve({
                listEnvironmentVariables: listEnvironmentVariablesStub.returns(Promise.resolve([])),
                setEnvironmentVariables: setEnvironmentVariablesStub.returns(Promise.resolve())
            }));
            getRateLimitStub.returns(Promise.resolve());
            repoCreateAuthorizationStub.returns(Promise.resolve({
                token: 'token'
            }));
            repoDeleteAuthorizationStub.returns(Promise.resolve());
            initAuthorization = loadModule_1.default(require, '../../../../../src/commands/initialize/initAuthorization', {
                '../../util/Travis': { default: TravisSpy },
                '../../util/GitHub': { default: GitHubSpy },
                '@dojo/shim/array': {
                    find: findStub
                },
                '../../util/environment': {
                    env: {
                        githubAuth: githubAuthStub
                    }
                }
            });
        },
        afterEach: function () {
            TravisSpy.reset();
            GitHubSpy.reset();
            isAuthorizedStub.reset();
            travisCreateAuthorizationStub.reset();
            travisDeleteAuthorizationStub.reset();
            listEnvironmentVariablesStub.reset();
            setEnvironmentVariablesStub.reset();
            fetchRepositoryStub.reset();
            authenticateStub.reset();
            getRateLimitStub.reset();
            toStringStub.reset();
            repoCreateAuthorizationStub.reset();
            repoDeleteAuthorizationStub.reset();
            findStub.reset();
            githubAuthStub.reset();
        },
        tests: {
            'initAuthorization': (function () {
                return {
                    'explicit Travis instance': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var travis;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        travis = new Travis();
                                        return [4, assertInitAuthorization(travis)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    },
                    'Travis is not authorized': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        isAuthorizedStub.returns(false);
                                        return [4, assertInitAuthorization()];
                                    case 1:
                                        _a.sent();
                                        assert.isTrue(travisCreateAuthorizationStub.calledOnce);
                                        return [2];
                                }
                            });
                        });
                    },
                    'fetch repo and environment, create authorization': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, assertInitAuthorization()];
                                    case 1:
                                        _a.sent();
                                        assert.isTrue(fetchRepositoryStub.calledOnce);
                                        assert.isTrue(listEnvironmentVariablesStub.calledOnce);
                                        assert.isTrue(findStub.calledOnce);
                                        assert.isTrue(repoCreateAuthorizationStub.calledOnce);
                                        assert.isTrue(setEnvironmentVariablesStub.calledOnce);
                                        return [2];
                                }
                            });
                        });
                    },
                    'eventually throws': function () {
                        fetchRepositoryStub.returns(Promise.reject(new Error('error')));
                        var promise = assertInitAuthorization();
                        return promise.then(util_1.throwWithError('Should reject when fetching repository stub fails'), function (e) {
                            assert.strictEqual(e.message, 'error');
                        });
                    },
                    'delete repo authorization': function () {
                        repoCreateAuthorizationStub.returns(Promise.resolve(true));
                        setEnvironmentVariablesStub.returns(Promise.reject(new Error('error')));
                        var promise = assertInitAuthorization();
                        return promise.then(util_1.throwWithError('Should reject when setting environment variables fails'), function () {
                            assert.isTrue(repoDeleteAuthorizationStub.calledOnce);
                        });
                    }
                };
                function assertInitAuthorization(travis) {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var repo;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    repo = new GitHub();
                                    return [4, initAuthorization(repo, travis)];
                                case 1:
                                    _a.sent();
                                    if (!travis) {
                                        assert.isTrue(TravisSpy.calledOnce);
                                    }
                                    assert.isTrue(isAuthorizedStub.calledOnce);
                                    assert.isTrue(travisDeleteAuthorizationStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                }
            })()
        }
    });
});
//# sourceMappingURL=initAuthorization.js.map