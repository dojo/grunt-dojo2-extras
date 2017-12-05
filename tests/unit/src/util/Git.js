(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../_support/loadModule", "sinon", "../../../../src/util/environment", "../../../_support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var env = require("../../../../src/util/environment");
    var util_1 = require("../../../_support/util");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var Module;
    var git;
    var promiseSpawnStub;
    var promiseExecStub;
    var execStub;
    var toStringStub;
    var existsSyncStub;
    var chmodSyncStub;
    registerSuite('util/Git', {
        before: function () {
            promiseSpawnStub = sinon_1.stub();
            promiseExecStub = sinon_1.stub();
            execStub = sinon_1.stub();
            toStringStub = sinon_1.stub();
            existsSyncStub = sinon_1.stub();
            chmodSyncStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            Module = loadModule_1.default(require, '../../../../src/util/Git', {
                './process': {
                    promiseSpawn: promiseSpawnStub,
                    promiseExec: promiseExecStub,
                    exec: execStub
                },
                './streams': {
                    toString: toStringStub
                },
                fs: {
                    existsSync: existsSyncStub,
                    chmodSync: chmodSyncStub
                }
            });
            git = new Module();
        },
        afterEach: function () {
            promiseSpawnStub.reset();
            promiseExecStub.reset();
            execStub.reset();
            toStringStub.reset();
            existsSyncStub.reset();
            chmodSyncStub.reset();
        },
        tests: {
            'constructor': {
                'with params': function () {
                    var gitWithArgs = new Module('dir', 'file');
                    assert.equal(gitWithArgs.cloneDirectory, 'dir');
                    assert.equal(gitWithArgs.keyFile, 'file');
                },
                'default params': function () {
                    assert.equal(git.cloneDirectory, process.cwd());
                    assert.equal(git.keyFile, env.keyFile());
                }
            },
            add: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var actual, _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                promiseExecStub.withArgs('git add file1 file2', {
                                    silent: false,
                                    cwd: git.cloneDirectory
                                }).returns('pass');
                                actual = git.add('file1', 'file2');
                                assert.instanceOf(actual, Promise);
                                _b = (_a = assert).strictEqual;
                                return [4, actual];
                            case 1:
                                _b.apply(_a, [_c.sent(), 'pass']);
                                return [2];
                        }
                    });
                });
            },
            assert: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        git.isInitialized = function () { return false; };
                        git.assert('url').then(util_1.throwWithError('Should reject when the repository is not initialized'), function (error) {
                            assert.strictEqual(error.message, "Repository is not initialized at \"" + git.cloneDirectory + "\"");
                        });
                        git.isInitialized = function () { return true; };
                        git.getConfig = sinon_1.stub().withArgs('remote.origin.url')
                            .returns('url');
                        git.assert('other_url').then(util_1.throwWithError('Should reject when the repository url is wrong'), function (error) {
                            assert.strictEqual(error.message, 'Repository mismatch. Expected "url" to be "other_url".');
                        });
                        return [2, git.assert('url')];
                    });
                });
            },
            checkout: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var actual, _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                promiseExecStub.withArgs('git checkout 1.2.3', {
                                    silent: false,
                                    cwd: git.cloneDirectory
                                }).returns(Promise.resolve('pass'));
                                actual = git.checkout('1.2.3');
                                assert.instanceOf(actual, Promise);
                                _b = (_a = assert).strictEqual;
                                return [4, actual];
                            case 1:
                                _b.apply(_a, [(_c.sent()), 'pass']);
                                return [2];
                        }
                    });
                });
            },
            clone: {
                'If clone directory is not set; eventually rejects': function () {
                    delete git.cloneDirectory;
                    return git.clone('url').then(util_1.throwWithError('Should reject if clone directory is not set'), function (error) {
                        assert.equal(error.message, 'A clone directory must be set');
                    });
                },
                'Not initialized; assert not called, execSSHAgent called once, git.url === url': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var url, assertSpy, execSSHAgentStub;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = 'url';
                                    assertSpy = sinon_1.spy(git, 'assert');
                                    execSSHAgentStub = sinon_1.stub(git, 'execSSHAgent').returns(Promise.resolve());
                                    git.isInitialized = function () { return false; };
                                    return [4, git.clone(url)];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(assertSpy.notCalled);
                                    assert.isTrue(execSSHAgentStub.called);
                                    assert.strictEqual(git.url, url);
                                    return [2];
                            }
                        });
                    });
                },
                'Properly initialized; assert called once, execSSHAgent called once, git.url === url': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var url, assertStub, execSSHAgentStub;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = 'url';
                                    assertStub = sinon_1.stub(git, 'assert');
                                    execSSHAgentStub = sinon_1.stub(git, 'execSSHAgent').returns(Promise.resolve());
                                    git.isInitialized = function () { return true; };
                                    return [4, git.clone(url)];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(assertStub.called);
                                    assert.isTrue(execSSHAgentStub.called);
                                    assert.strictEqual(git.url, url);
                                    return [2];
                            }
                        });
                    });
                }
            },
            commit: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var execSSHAgent;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                execSSHAgent = sinon_1.stub(git, 'execSSHAgent').returns(Promise.resolve());
                                return [4, git.commit('message')];
                            case 1:
                                _a.sent();
                                assert.isTrue(execSSHAgent.calledOnce);
                                assert.isTrue(execSSHAgent.calledWith('git', ['commit', '-m', '"message"'], { silent: false, cwd: git.cloneDirectory }));
                                return [2];
                        }
                    });
                });
            },
            createOrphan: {
                'If clone directory is not set; throws': function () {
                    delete git.cloneDirectory;
                    git.createOrphan('branch').then(util_1.throwWithError('Should throw when clone directory is not set'), function (error) {
                        assert.equal(error.message, 'A clone directory must be set');
                    });
                },
                'promiseExec called twice with proper options': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var execOptions;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    execOptions = { silent: true, cwd: git.cloneDirectory };
                                    return [4, git.createOrphan('branch')];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(promiseExecStub.calledTwice);
                                    assert.isTrue(promiseExecStub.calledWith('git checkout --orphan branch', execOptions));
                                    assert.isTrue(promiseExecStub.calledWith('git rm -rf .', execOptions));
                                    return [2];
                            }
                        });
                    });
                }
            },
            ensureConfig: {
                'hasConfig for user.name, user.email': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var setConfig;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    git.hasConfig = sinon_1.stub().returns(true);
                                    setConfig = git.setConfig = sinon_1.stub();
                                    return [4, git.ensureConfig()];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(setConfig.notCalled);
                                    return [2];
                            }
                        });
                    });
                },
                '!hasConfig for user.name, user.email; default args set': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var setConfig;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    git.hasConfig = sinon_1.stub().returns(false);
                                    setConfig = git.setConfig = sinon_1.stub();
                                    return [4, git.ensureConfig()];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(setConfig.calledWith('user.name', 'Travis CI'));
                                    assert.isTrue(setConfig.calledWith('user.email', 'support@sitepen.com'));
                                    return [2];
                            }
                        });
                    });
                },
                '!hasConfig for user.name, user.email; explicit args set': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var setConfig;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    git.hasConfig = sinon_1.stub().returns(false);
                                    setConfig = git.setConfig = sinon_1.stub();
                                    return [4, git.ensureConfig('name', 'email')];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(setConfig.calledWith('user.name', 'name'));
                                    assert.isTrue(setConfig.calledWith('user.email', 'email'));
                                    return [2];
                            }
                        });
                    });
                }
            },
            execSSHAgent: {
                '!hasDeployCredentials; promiseSpawn called': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var command, args, opts;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command = 'git';
                                    args = ['status'];
                                    opts = { silent: false };
                                    git.hasDeployCredentials = function () { return false; };
                                    return [4, git.execSSHAgent(command, args, opts)];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(promiseSpawnStub.calledOnce);
                                    assert.isTrue(promiseSpawnStub.calledWith(command, args, opts));
                                    return [2];
                            }
                        });
                    });
                },
                'hasDeployCredentials; chmodSync, promiseExec called': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var command, args, opts;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command = 'git';
                                    args = ['status'];
                                    opts = { silent: false };
                                    git.keyFile = 'key.file';
                                    git.hasDeployCredentials = function () { return true; };
                                    return [4, git.execSSHAgent(command, args, opts)];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(chmodSyncStub.calledOnce);
                                    assert.isTrue(promiseExecStub.calledOnce);
                                    assert.isTrue(promiseExecStub.calledWith("ssh-agent bash -c 'ssh-add key.file; git status'", opts));
                                    return [2];
                            }
                        });
                    });
                }
            },
            getConfig: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var keyConfig;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                existsSyncStub.withArgs(git.cloneDirectory).returns(true);
                                execStub.withArgs('git config key', {
                                    silent: true,
                                    cwd: git.cloneDirectory
                                }).returns({ stdout: 'key' });
                                toStringStub.withArgs('key').returns('key');
                                return [4, git.getConfig('key')];
                            case 1:
                                keyConfig = _a.sent();
                                assert.isTrue(execStub.calledOnce);
                                assert.isTrue(toStringStub.calledOnce);
                                assert.strictEqual(keyConfig, 'key');
                                return [2];
                        }
                    });
                });
            },
            getConfigDirectoryDoesNotExist: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var cwd, cloneDirectory, keyConfig;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cwd = process.cwd();
                                cloneDirectory = git.cloneDirectory;
                                existsSyncStub.withArgs(cwd).returns(false);
                                execStub.withArgs('git config key', {
                                    silent: true,
                                    cwd: cwd
                                }).returns({ stdout: 'key' });
                                toStringStub.withArgs('key').returns('key');
                                git.cloneDirectory = '_does_not_exist_';
                                return [4, git.getConfig('key')];
                            case 1:
                                keyConfig = _a.sent();
                                git.cloneDirectory = cloneDirectory;
                                assert.isTrue(execStub.calledOnce);
                                assert.isTrue(toStringStub.calledOnce);
                                assert.strictEqual(keyConfig, 'key');
                                return [2];
                        }
                    });
                });
            },
            areFilesChanged: {
                beforeEach: function () {
                    execStub.withArgs('git status --porcelain', {
                        silent: true,
                        cwd: git.cloneDirectory
                    });
                },
                tests: {
                    'exec and toString each called once': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        execStub.returns({ stdout: '' });
                                        toStringStub.returns('');
                                        return [4, git.areFilesChanged()];
                                    case 1:
                                        _a.sent();
                                        assert.isTrue(execStub.calledOnce);
                                        assert.isTrue(toStringStub.calledOnce);
                                        return [2];
                                }
                            });
                        });
                    },
                    'files are changed; returns true': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var changed;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        execStub.returns({ stdout: 'changed' });
                                        toStringStub.withArgs('changed').returns('changed');
                                        return [4, git.areFilesChanged()];
                                    case 1:
                                        changed = _a.sent();
                                        assert.isTrue(changed);
                                        return [2];
                                }
                            });
                        });
                    },
                    'files are not changed; returns false': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var changed;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        execStub.returns({ stdout: '' });
                                        toStringStub.withArgs('').returns('');
                                        return [4, git.areFilesChanged()];
                                    case 1:
                                        changed = _a.sent();
                                        assert.isFalse(changed);
                                        return [2];
                                }
                            });
                        });
                    }
                }
            },
            hasConfig: {
                'has a configuration value': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var hasConfig;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    git.getConfig = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                        return [2, 'config'];
                                    }); }); };
                                    return [4, git.hasConfig('config')];
                                case 1:
                                    hasConfig = _a.sent();
                                    assert.isTrue(hasConfig);
                                    return [2];
                            }
                        });
                    });
                },
                'has no configuration value': function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var hasConfig;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    git.getConfig = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                        return [2, ''];
                                    }); }); };
                                    return [4, git.hasConfig('config')];
                                case 1:
                                    hasConfig = _a.sent();
                                    assert.isFalse(hasConfig);
                                    return [2];
                            }
                        });
                    });
                }
            },
            hasDeployCredentials: function () {
                var exists = existsSyncStub.withArgs(git.keyFile);
                exists.returns(true);
                assert.isTrue(git.hasDeployCredentials());
                exists.returns(false);
                assert.isFalse(git.hasDeployCredentials());
            },
            headRevision: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var hash, revision;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                hash = '505b86ca8feb5295789720ef9d56cf016c217b0e';
                                execStub.withArgs('git rev-parse HEAD', {
                                    silent: false,
                                    cwd: git.cloneDirectory
                                }).returns({ stdout: hash });
                                toStringStub.withArgs(hash)
                                    .returns(hash);
                                return [4, git.headRevision()];
                            case 1:
                                revision = _a.sent();
                                assert.isTrue(execStub.calledOnce);
                                assert.isTrue(toStringStub.calledOnce);
                                assert.strictEqual(revision, hash);
                                return [2];
                        }
                    });
                });
            },
            isInitialized: {
                'throws error if there is no cloneDirectory': function () {
                    git.cloneDirectory = undefined;
                    assert.throws(git.isInitialized);
                    try {
                        git.isInitialized();
                    }
                    catch (e) {
                        assert.strictEqual(e.message, 'A clone directory must be set');
                    }
                },
                'cloneDirectory exists but not counterpart .git directory; returns false': function () {
                    existsSyncStub.returns(false);
                    existsSyncStub.withArgs(git.cloneDirectory).returns(true);
                    assert.isFalse(git.isInitialized());
                },
                'cloneDirectory and .git directory exist; returns true': function () {
                    existsSyncStub.returns(true);
                    assert.isTrue(git.isInitialized());
                }
            },
            pull: function () {
                var execSSHAgentStub = git.execSSHAgent = sinon_1.stub();
                git.pull('origin', 'master');
                assert.isTrue(execSSHAgentStub.calledWith('git', ['pull', 'origin', 'master'], { cwd: git.cloneDirectory }));
                git.pull();
                assert.isTrue(execSSHAgentStub.calledWith('git', ['pull'], { cwd: git.cloneDirectory }));
            },
            push: function () {
                var execSSHAgentStub = git.execSSHAgent = sinon_1.stub();
                git.push('master', 'origin');
                assert.isTrue(execSSHAgentStub.calledWith('git', ['push', 'origin', 'master'], { silent: false, cwd: git.cloneDirectory }));
                git.push();
                assert.isTrue(execSSHAgentStub.calledWith('git', ['push'], { silent: false, cwd: git.cloneDirectory }));
            },
            setConfig: function () {
                git.setConfig('key', 'value');
                assert.isTrue(promiseExecStub.calledWith('git config --global key value', { silent: false }));
            }
        }
    });
});
//# sourceMappingURL=Git.js.map