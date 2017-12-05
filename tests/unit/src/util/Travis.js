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
    var module;
    var travis;
    var repository;
    var requestStub;
    registerSuite('util/Travis', {
        before: function () {
            requestStub = sinon_1.stub();
            requestStub.post = sinon_1.stub();
            requestStub.get = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            module = loadModule_1.default(require, '../../../../src/util/Travis', {
                '@dojo/core/request': { default: requestStub }
            }, false);
        },
        afterEach: function () {
            requestStub.reset();
            requestStub.post.reset();
            requestStub.get.reset();
        },
        tests: {
            'Travis': {
                beforeEach: function () {
                    travis = new module.default();
                },
                tests: {
                    authenticate: function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var token, accessToken, post, authenticate;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        token = 'token';
                                        accessToken = 'access_token';
                                        post = requestStub.post;
                                        post.returns(Promise.resolve({ json: function () { return Promise.resolve({ 'access_token': accessToken }); } }));
                                        return [4, travis.authenticate(token)];
                                    case 1:
                                        authenticate = _a.sent();
                                        assert.strictEqual(post.lastCall.args[1].body, '{"github_token":"token"}');
                                        assert.strictEqual(travis.token, accessToken);
                                        assert.strictEqual(authenticate, accessToken);
                                        return [2];
                                }
                            });
                        });
                    },
                    createAuthorization: (function () {
                        var repo;
                        var tokenAuth = { token: 'token' };
                        return {
                            beforeEach: function () {
                                repo = {
                                    createAuthorization: sinon_1.stub().returns(Promise.resolve(tokenAuth)),
                                    findAuthorization: sinon_1.stub().returns(Promise.resolve())
                                };
                            },
                            afterEach: function () {
                                repo.createAuthorization.reset();
                                repo.findAuthorization.reset();
                            },
                            tests: {
                                'existing authorization; eventually throws': function () {
                                    repo.findAuthorization.returns(Promise.resolve({ id: 1 }));
                                    var promise = travis.createAuthorization(repo);
                                    return promise.then(util_1.throwWithError('Should reject when an authorization exists'), function (e) {
                                        assert.strictEqual(e.message, 'An existing authorization exists. "#1"');
                                        assert.isTrue(repo.createAuthorization.notCalled);
                                        assert.isTrue(repo.findAuthorization.calledOnce);
                                    });
                                },
                                'authentication succeeds': function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        var auth, deleteAuth;
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    auth = sinon_1.stub(travis, 'authenticate').returns(Promise.resolve());
                                                    deleteAuth = sinon_1.stub(travis, 'deleteAuthorization');
                                                    return [4, travis.createAuthorization(repo)];
                                                case 1:
                                                    _a.sent();
                                                    assert.isTrue(repo.createAuthorization.calledOnce);
                                                    assert.isTrue(auth.calledOnce);
                                                    assert.isTrue(deleteAuth.notCalled);
                                                    assert.isTrue(travis.isAuthorized());
                                                    auth.restore();
                                                    deleteAuth.restore();
                                                    return [2];
                                            }
                                        });
                                    });
                                },
                                'authentication fails; eventually throws': function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        var auth, deleteAuth;
                                        return tslib_1.__generator(this, function (_a) {
                                            auth = sinon_1.stub(travis, 'authenticate').returns(Promise.reject(undefined));
                                            deleteAuth = sinon_1.stub(travis, 'deleteAuthorization').returns(Promise.resolve());
                                            return [2, travis.createAuthorization(repo).then(function () {
                                                    auth.restore();
                                                    deleteAuth.restore();
                                                    throw new Error('Should reject when authentication fails');
                                                }, function () {
                                                    auth.restore();
                                                    deleteAuth.restore();
                                                    assert.isTrue(auth.calledOnce);
                                                    assert.isTrue(deleteAuth.calledOnce);
                                                })];
                                        });
                                    });
                                }
                            }
                        };
                    })(),
                    deleteAuthorization: (function () {
                        var repo;
                        return {
                            beforeEach: function () {
                                repo = {
                                    deleteAuthorization: sinon_1.stub()
                                };
                            },
                            afterEach: function () {
                                repo.deleteAuthorization.reset();
                            },
                            tests: {
                                'not authorized': function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4, travis.deleteAuthorization(repo)];
                                                case 1:
                                                    _a.sent();
                                                    assert.isTrue(repo.deleteAuthorization.notCalled);
                                                    return [2];
                                            }
                                        });
                                    });
                                },
                                'authorized': function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        var create;
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    create = sinon_1.stub(travis, 'createAuthorization', function () {
                                                        this.githubAuthorization = { id: 1 };
                                                    }.bind(travis));
                                                    create();
                                                    return [4, travis.deleteAuthorization(repo)];
                                                case 1:
                                                    _a.sent();
                                                    assert.isTrue(repo.deleteAuthorization.calledOnce);
                                                    assert.isTrue(repo.deleteAuthorization.calledWith(1));
                                                    create.restore();
                                                    return [2];
                                            }
                                        });
                                    });
                                }
                            }
                        };
                    })(),
                    fetchRepository: {
                        authorized: function () {
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var fetchRepository;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            requestStub.get.returns(Promise.resolve({
                                                json: function () { return Promise.resolve({
                                                    repo: 'repo'
                                                }); }
                                            }));
                                            travis.token = 'token';
                                            return [4, travis.fetchRepository('slug')];
                                        case 1:
                                            fetchRepository = _a.sent();
                                            assert.isTrue(requestStub.get.calledOnce);
                                            assert.instanceOf(fetchRepository, module.Repository);
                                            return [2];
                                    }
                                });
                            });
                        },
                        'not authorized': function () {
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    return [2, travis.fetchRepository('slug')
                                            .then(function () {
                                            assert.fail('Should not have resolved');
                                        })
                                            .catch(function () { })];
                                });
                            });
                        }
                    },
                    isAuthorized: {
                        'authorized': function () {
                            var create = sinon_1.stub(travis, 'createAuthorization', function () {
                                this.githubAuthorization = { id: 1 };
                            }.bind(travis));
                            create();
                            assert.isTrue(travis.isAuthorized());
                            create.restore();
                        },
                        'not authorized': function () {
                            assert.isFalse(travis.isAuthorized());
                        }
                    }
                }
            },
            'Repository': (function () {
                var envVarArr = [{
                        id: 'id',
                        name: 'name',
                        value: 'value',
                        'public': true,
                        repository_id: 1
                    }];
                var repo = {
                    active: 'active',
                    id: 'grunt-dojo2-extras',
                    slug: 'extras'
                };
                var token = 'access_token';
                return {
                    beforeEach: function () {
                        repository = new module.Repository(token, repo);
                    },
                    tests: {
                        'constructor': function () {
                            assert.isTrue(repository.active);
                            assert.strictEqual("" + repository.id, "" + repo.id);
                            assert.strictEqual(repository.slug, repo.slug);
                            assert.strictEqual(repository.token, token);
                        },
                        listEnvironmentVariables: function () {
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var envVars;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            requestStub.get.returns(Promise.resolve({
                                                json: function () { return Promise.resolve({
                                                    'env_vars': Promise.resolve(envVarArr)
                                                }); }
                                            }));
                                            return [4, repository.listEnvironmentVariables()];
                                        case 1:
                                            envVars = _a.sent();
                                            assert.isTrue(requestStub.get.calledOnce);
                                            assert.strictEqual(envVars, envVarArr);
                                            return [2];
                                    }
                                });
                            });
                        },
                        setEnvironmentVariables: (function () {
                            var envVars;
                            return {
                                beforeEach: function () {
                                    envVars = sinon_1.stub(repository, 'listEnvironmentVariables').returns(Promise.resolve(envVarArr));
                                },
                                afterEach: function () {
                                    envVars.restore();
                                },
                                tests: {
                                    'update existing variable': function () {
                                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        requestStub.returns(Promise.resolve({ json: function () { } }));
                                                        return [4, repository.setEnvironmentVariables({
                                                                name: 'name',
                                                                value: 'new value'
                                                            })];
                                                    case 1:
                                                        _a.sent();
                                                        assert.isTrue(requestStub.calledOnce);
                                                        return [2];
                                                }
                                            });
                                        });
                                    },
                                    'add new environment variable': function () {
                                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        requestStub.post.returns(Promise.resolve({ json: function () { } }));
                                                        return [4, repository.setEnvironmentVariables({
                                                                name: 'new name',
                                                                value: 'value'
                                                            })];
                                                    case 1:
                                                        _a.sent();
                                                        assert.isTrue(requestStub.post.calledOnce);
                                                        return [2];
                                                }
                                            });
                                        });
                                    }
                                }
                            };
                        })()
                    }
                };
            })()
        }
    });
});
//# sourceMappingURL=Travis.js.map