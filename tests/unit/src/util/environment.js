(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../../src/util/environment", "../../../_support/loadModule", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var environment = require("../../../../src/util/environment");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var file = 'test.file';
    var mappedEnvs;
    var module;
    var existsSyncStub;
    registerSuite('util/environment', {
        before: function () {
            var relevantEnv = [
                'TRAVIS_COMMIT_MESSAGE',
                'TRAVIS_BRANCH',
                'ENCRYPTED_KEY_FILE',
                'TRAVIS_COMMIT',
                'HAS_GIT_CREDENTIALS',
                'HEXO_ROOT',
                'TRAVIS_EVENT_TYPE',
                'KEY_FILE',
                'DEPLOY_DOCS',
                'PUBLISH_TARGET_REPO',
                'TRAVIS_REPO_SLUG'
            ];
            mappedEnvs = relevantEnv.map(function (name) { return ({ name: name, value: process.env[name] }); });
            existsSyncStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            module = loadModule_1.default(require, '../../../../src/util/environment', {
                fs: {
                    existsSync: existsSyncStub
                }
            }, false);
        },
        afterEach: function () {
            mappedEnvs.forEach(function (val) {
                if (val.value) {
                    process.env[val.name] = val.value;
                }
                else {
                    delete process.env[val.name];
                }
            });
            existsSyncStub.reset();
        },
        tests: {
            commitMessage: function () {
                var expected = 'update test coverage for `util/environment`';
                process.env.TRAVIS_COMMIT_MESSAGE = expected;
                assert.equal(environment.commitMessage(), expected);
            },
            currentBranch: function () {
                var expected = 'master';
                process.env.TRAVIS_BRANCH = expected;
                assert.equal(environment.currentBranch(), expected);
            },
            encryptedKeyFile: {
                'returns ENCRYPTED_KEY_FILE': function () {
                    var filename = 'keyfile';
                    var fileWithExt = filename + '.enc';
                    delete process.env.KEY_FILE;
                    process.env.ENCRYPTED_KEY_FILE = fileWithExt;
                    assert.equal(environment.encryptedKeyFile(), fileWithExt);
                },
                'returns value passed': function () {
                    var filename = 'keyfile';
                    var fileWithExt = filename + '.enc';
                    delete process.env.ENCRYPTED_KEY_FILE;
                    assert.equal(environment.encryptedKeyFile(filename), fileWithExt);
                },
                'returns default encrypted key file': function () {
                    var keyFileDefault = 'deploy_key.enc';
                    delete process.env.ENCRYPTED_KEY_FILE;
                    delete process.env.KEY_FILE;
                    assert.equal(environment.encryptedKeyFile(), keyFileDefault);
                }
            },
            gitCommit: function () {
                var hash = 'ad64g9cc';
                process.env.TRAVIS_COMMIT = hash;
                assert.equal(environment.gitCommit(), hash);
            },
            hasGitCredentials: {
                'HAS_GIT_CREDENTIALS set: returns true': function () {
                    process.env.HAS_GIT_CREDENTIALS = 'true';
                    assert.isTrue(module.hasGitCredentials());
                },
                'Running on Travis; no key file: returns false': function () {
                    existsSyncStub.returns(false);
                    delete process.env.HAS_GIT_CREDENTIALS;
                    process.env.TRAVIS_BRANCH = 'master';
                    assert.isFalse(module.hasGitCredentials(file));
                },
                'Running on Travis; with key file: returns true': function () {
                    existsSyncStub.returns(true);
                    delete process.env.HAS_GIT_CREDENTIALS;
                    process.env.TRAVIS_BRANCH = 'master';
                    assert.isTrue(module.hasGitCredentials(file));
                    assert.isTrue(existsSyncStub.called);
                    assert.strictEqual(existsSyncStub.lastCall.args[0], file);
                },
                'Running locally: returns true': function () {
                    delete process.env.HAS_GIT_CREDENTIALS;
                    delete process.env.TRAVIS_BRANCH;
                    assert.isTrue(module.hasGitCredentials());
                }
            },
            hexoRootOverride: function () {
                var hexoRoot = 'hexoRoot';
                process.env.HEXO_ROOT = hexoRoot;
                assert.equal(environment.hexoRootOverride(), hexoRoot);
            },
            hasKeyFile: function () {
                assert.isFalse(environment.hasKeyFile(file));
            },
            isCronJob: function () {
                process.env.TRAVIS_EVENT_TYPE = 'not cron';
                assert.isFalse(environment.isCronJob());
            },
            isRunningOnTravis: function () {
                delete process.env.TRAVIS_BRANCH;
                assert.isFalse(environment.isRunningOnTravis());
            },
            keyFile: {
                'returns KEY_FILE': function () {
                    var fileName = 'key_file';
                    process.env.KEY_FILE = fileName;
                    assert.equal(environment.keyFile(), fileName);
                },
                'returns value passed': function () {
                    delete process.env.KEY_FILE;
                    assert.equal(environment.keyFile(), 'deploy_key');
                }
            },
            publishMode: {
                'returns DEPLOY_DOCS': function () {
                    var commit = 'commit';
                    process.env.DEPLOY_DOCS = commit;
                    assert.equal(environment.publishMode(), commit);
                },
                'returns `skip` if running on Travis': function () {
                    delete process.env.DEPLOY_DOCS;
                    process.env.TRAVIS_BRANCH = 'master';
                    assert.equal(environment.publishMode(), 'skip');
                }
            },
            repositorySource: {
                'returns PUBLISH_TARGET_REPO if available': function () {
                    var target = 'target repo';
                    process.env.PUBLISH_TARGET_REPO = target;
                    assert.equal(environment.repositorySource(), target);
                },
                'returns TRAVIS_REPO_SLUG if PUBLISH_TARGET_REPO unavailable': function () {
                    delete process.env.PUBLISH_TARGET_REPO;
                    var slug = 'target_repo';
                    process.env.TRAVIS_REPO_SLUG = slug;
                    assert.equal(environment.repositorySource(), slug);
                },
                'returns empty string if TRAVIS_REPO_SLUG and PUBLISH_TARGET_REPO unavailable': function () {
                    delete process.env.TRAVIS_REPO_SLUG;
                    assert.equal(environment.repositorySource(), '');
                }
            }
        }
    });
});
//# sourceMappingURL=environment.js.map