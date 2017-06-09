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
        define(["require", "exports", "intern!object", "intern/chai!assert", "../../../../_support/loadModule", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var loadModule_1 = require("../../../../_support/loadModule");
    var sinon_1 = require("sinon");
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
    registerSuite({
        name: 'commands/initialize/initAuthorization',
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
            initAuthorization = loadModule_1.default('src/commands/initialize/initAuthorization', {
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
        'initAuthorization': (function () {
            return {
                'explicit Travis instance': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var travis;
                        return __generator(this, function (_a) {
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
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
                    return promise.then(assert.fail, function (e) {
                        assert.strictEqual(e.message, 'error');
                    });
                },
                'delete repo authorization': function () {
                    repoCreateAuthorizationStub.returns(Promise.resolve(true));
                    setEnvironmentVariablesStub.returns(Promise.reject(new Error('error')));
                    var promise = assertInitAuthorization();
                    return promise.then(assert.fail, function () {
                        assert.isTrue(repoDeleteAuthorizationStub.calledOnce);
                    });
                }
            };
            function assertInitAuthorization(travis) {
                return __awaiter(this, void 0, void 0, function () {
                    var repo;
                    return __generator(this, function (_a) {
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
    });
});
//# sourceMappingURL=initAuthorization.js.map