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
        define(["require", "exports", "intern!object", "intern/chai!assert", "../../../_support/loadModule", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var Module;
    var github;
    var githubAuthStub;
    var hasGitCredentialsStub;
    var authorizationGetAllStub;
    var GitHubApiSpy;
    registerSuite({
        name: 'util/GitHub',
        before: function () {
            githubAuthStub = sinon_1.stub();
            hasGitCredentialsStub = sinon_1.stub();
            authorizationGetAllStub = sinon_1.stub();
            var GitHubApi = (function () {
                function class_1() {
                    this.authenticate = sinon_1.stub();
                    this.authorization = {
                        create: sinon_1.stub().returns({ data: 'create' }),
                        delete: sinon_1.stub(),
                        getAll: authorizationGetAllStub
                    };
                    this.repos = {
                        createKey: sinon_1.stub().returns({ data: 'createKey' }),
                        deleteKey: sinon_1.stub(),
                        getReleases: sinon_1.stub().returns({ data: 'getReleases' })
                    };
                }
                Object.defineProperty(class_1.prototype, "auth", {
                    get: function () {
                        return true;
                    },
                    enumerable: true,
                    configurable: true
                });
                return class_1;
            }());
            GitHubApiSpy = sinon_1.spy(GitHubApi);
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            Module = loadModule_1.default('src/util/GitHub', {
                './environment': {
                    githubAuth: githubAuthStub,
                    hasGitCredentials: hasGitCredentialsStub
                },
                'github': GitHubApiSpy
            });
            github = new Module('dojo', 'grunt-dojo2-extras');
        },
        afterEach: function () {
            githubAuthStub.reset();
            hasGitCredentialsStub.reset();
            authorizationGetAllStub.reset();
            GitHubApiSpy.reset();
        },
        'constructor': {
            'without owner; throws Error': function () {
                try {
                    new Module();
                }
                catch (e) {
                    assert.equal(e.message, 'A repo owner must be specified');
                }
            },
            'without name; throws Error': function () {
                try {
                    new Module('dojo');
                }
                catch (e) {
                    assert.equal(e.message, 'A repo name must be specified');
                }
            },
            'properly initialized; _api, owner, and name set': function () {
                assert.isTrue(GitHubApiSpy.calledOnce);
                assert.strictEqual(github.owner, 'dojo');
                assert.strictEqual(github.name, 'grunt-dojo2-extras');
            }
        },
        'get api': function () {
            github.isApiAuthenticated = sinon_1.stub();
            var api = github.api;
            assert.strictEqual(api, github._api);
        },
        'get url': (function () {
            return {
                'has git credentials; returns ssh url': function () {
                    var getSshUrl = sinon_1.stub(github, 'getSshUrl');
                    hasGitCredentialsStub.returns(true);
                    assertCredentials();
                    assert.isTrue(getSshUrl.calledOnce);
                    getSshUrl.reset();
                },
                'doesn\'t have git credentials; returns https url': function () {
                    var getHttpsUrl = sinon_1.stub(github, 'getHttpsUrl');
                    hasGitCredentialsStub.returns(false);
                    assertCredentials();
                    assert.isTrue(getHttpsUrl.calledOnce);
                    getHttpsUrl.reset();
                }
            };
            function assertCredentials() {
                var url = github.url;
                assert.isTrue(hasGitCredentialsStub.calledOnce);
                return url;
            }
        })(),
        createAuthorization: function () {
            return __awaiter(this, void 0, void 0, function () {
                var createAuth;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, github.createAuthorization({})];
                        case 1:
                            createAuth = _a.sent();
                            assert.strictEqual(createAuth, 'create');
                            return [2];
                    }
                });
            });
        },
        createKey: function () {
            return __awaiter(this, void 0, void 0, function () {
                var createKey, api;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, github.createKey('key')];
                        case 1:
                            createKey = _a.sent();
                            api = GitHubApiSpy.lastCall.returnValue;
                            assert.strictEqual(createKey, 'createKey');
                            assert.strictEqual(api.repos.createKey.lastCall.args[0].key, 'key');
                            return [2];
                    }
                });
            });
        },
        deleteAuthorization: (function () {
            return {
                'given numeric id; deleteAuthorization passes it as a string': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var api;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, deleteAuthReturnSpy(2)];
                                case 1:
                                    api = _a.sent();
                                    assert.strictEqual(api.authorization.delete.lastCall.args[0].id, '2');
                                    return [2];
                            }
                        });
                    });
                },
                'given string id; deleteAuthorization passes it intact': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var api;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, deleteAuthReturnSpy('id')];
                                case 1:
                                    api = _a.sent();
                                    assert.strictEqual(api.authorization.delete.lastCall.args[0].id, 'id');
                                    return [2];
                            }
                        });
                    });
                }
            };
            function deleteAuthReturnSpy(id) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, github.deleteAuthorization(id)];
                            case 1:
                                _a.sent();
                                return [2, GitHubApiSpy.lastCall.returnValue];
                        }
                    });
                });
            }
        })(),
        deleteKey: (function () {
            return {
                'given numeric id; deleteKey passes it as a string': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var api;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, deleteKeyReturnSpy(2)];
                                case 1:
                                    api = _a.sent();
                                    assert.strictEqual(api.repos.deleteKey.lastCall.args[0].id, '2');
                                    return [2];
                            }
                        });
                    });
                },
                'given string id; deleteKey passes it intact': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var api;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, deleteKeyReturnSpy('id')];
                                case 1:
                                    api = _a.sent();
                                    assert.strictEqual(api.repos.deleteKey.lastCall.args[0].id, 'id');
                                    return [2];
                            }
                        });
                    });
                }
            };
            function deleteKeyReturnSpy(id) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, github.deleteKey(id)];
                            case 1:
                                _a.sent();
                                return [2, GitHubApiSpy.lastCall.returnValue];
                        }
                    });
                });
            }
        })(),
        fetchReleases: function () {
            return __awaiter(this, void 0, void 0, function () {
                var fetchReleases, api;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, github.fetchReleases()];
                        case 1:
                            fetchReleases = _a.sent();
                            api = GitHubApiSpy.lastCall.returnValue;
                            assert.strictEqual(fetchReleases, 'getReleases');
                            assert.isTrue(api.repos.getReleases.calledOnce);
                            return [2];
                    }
                });
            });
        },
        findAuthorization: (function () {
            var findAuthParams = {
                note: 'temporary token for travis cli',
                scopes: [
                    'read:org', 'user:email', 'repo_deployment', 'repo:status', 'public_repo', 'write:repo_hook'
                ]
            };
            var scope = { scopes: ['read:org'] };
            var note = { note: 'temporary token for travis cli' };
            return {
                'api.authorization.getAll returns no data; returns undefined': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var authGetAll;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    authorizationGetAllStub.returns({});
                                    return [4, assertAuthGetAllCalled({})];
                                case 1:
                                    authGetAll = _a.sent();
                                    assert.isUndefined(authGetAll);
                                    return [2];
                            }
                        });
                    });
                },
                'api.authorization.getAll returns array of data': {
                    'getAll response data contain an array similar to params array member': function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var AuthGetAll;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        authorizationGetAllStub.returns({ data: [findAuthParams] });
                                        return [4, assertAuthGetAllCalled(scope)];
                                    case 1:
                                        AuthGetAll = _a.sent();
                                        assert.strictEqual(AuthGetAll, findAuthParams);
                                        return [2];
                                }
                            });
                        });
                    },
                    'getAll response data do not contain an array': function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var AuthGetAll;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        authorizationGetAllStub.returns({ data: [note] });
                                        return [4, assertAuthGetAllCalled(note)];
                                    case 1:
                                        AuthGetAll = _a.sent();
                                        assert.strictEqual(AuthGetAll, note);
                                        return [2];
                                }
                            });
                        });
                    },
                    'findAuthorization params contain no array': function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var AuthGetAll;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        authorizationGetAllStub.returns({ data: [findAuthParams] });
                                        return [4, assertAuthGetAllCalled(note)];
                                    case 1:
                                        AuthGetAll = _a.sent();
                                        assert.strictEqual(AuthGetAll, findAuthParams);
                                        return [2];
                                }
                            });
                        });
                    }
                }
            };
            function assertAuthGetAllCalled(params) {
                return __awaiter(this, void 0, void 0, function () {
                    var findAuth;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, github.findAuthorization(params)];
                            case 1:
                                findAuth = _a.sent();
                                assert.isTrue(authorizationGetAllStub.calledOnce);
                                return [2, findAuth];
                        }
                    });
                });
            }
        })(),
        isApiAuthenticated: {
            'not authenticated; calls githubAuth': {
                'githubAuth returns truthy; calls this._api.authenticate with return value': function () {
                    var authValue = { user: 'dojo' };
                    githubAuthStub.returns(authValue);
                    github.isApiAuthenticated();
                    var git = GitHubApiSpy.lastCall.returnValue;
                    assert.isTrue(git.authenticate.calledOnce);
                    assert.isTrue(git.authenticate.calledWith(authValue));
                },
                'githubAuth returns falsy; this._api.authenticate not called': function () {
                    github.isApiAuthenticated();
                    var git = GitHubApiSpy.lastCall.returnValue;
                    assert.isTrue(git.authenticate.notCalled);
                }
            },
            'authenticated after first call; subsequent calls simply return API has OAuth token': function () {
                var authed = github.isApiAuthenticated();
                assert.isTrue(authed);
                authed = github.isApiAuthenticated();
                assert.isTrue(authed);
                assert.isTrue(githubAuthStub.calledOnce);
            }
        },
        getHttpsUrl: function () {
            var getHttpsUrl = github.getHttpsUrl();
            assert.strictEqual(getHttpsUrl, 'https://github.com/dojo/grunt-dojo2-extras.git');
        },
        getSshUrl: function () {
            var getSshUrl = github.getSshUrl();
            assert.strictEqual(getSshUrl, 'git@github.com:dojo/grunt-dojo2-extras.git');
        },
        toString: function () {
            var toString = github.toString();
            assert.strictEqual(toString, 'dojo/grunt-dojo2-extras');
        }
    });
});
//# sourceMappingURL=GitHub.js.map