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
    var Module;
    var github;
    var githubAuthStub;
    var hasGitCredentialsStub;
    var authorizationGetAllStub;
    var GitHubApiSpy;
    registerSuite('util/GitHub', {
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
                        getTags: sinon_1.stub().returns({ data: 'getTags' })
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
            Module = loadModule_1.default(require, '../../../../src/util/GitHub', {
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
        tests: {
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
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var createAuth;
                    return tslib_1.__generator(this, function (_a) {
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
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var createKey, api;
                    return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var api;
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var api;
                            return tslib_1.__generator(this, function (_a) {
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
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var api;
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var api;
                            return tslib_1.__generator(this, function (_a) {
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
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
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
            fetchTags: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var fetchTags, api;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, github.fetchTags()];
                            case 1:
                                fetchTags = _a.sent();
                                api = GitHubApiSpy.lastCall.returnValue;
                                assert.strictEqual(fetchTags, 'getTags');
                                assert.isTrue(api.repos.getTags.calledOnce);
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var authGetAll;
                            return tslib_1.__generator(this, function (_a) {
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
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var AuthGetAll;
                                return tslib_1.__generator(this, function (_a) {
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
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var AuthGetAll;
                                return tslib_1.__generator(this, function (_a) {
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
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var AuthGetAll;
                                return tslib_1.__generator(this, function (_a) {
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
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var findAuth;
                        return tslib_1.__generator(this, function (_a) {
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
        }
    });
});
//# sourceMappingURL=GitHub.js.map