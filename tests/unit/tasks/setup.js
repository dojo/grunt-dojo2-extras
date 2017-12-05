(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "grunt", "sinon", "../../_support/loadModule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var grunt = require("grunt");
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../_support/loadModule");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var setup;
    var registerMultiTaskStub;
    var authenticateStub = sinon_1.stub();
    var getGithubSlugStub = sinon_1.stub();
    var initDeploymentStub = sinon_1.stub();
    var initAuthorizationStub = sinon_1.stub();
    var wrapAsyncTaskStub = sinon_1.stub();
    var optionsStub = sinon_1.stub();
    var GitHub = (function () {
        function class_1() {
            this.api = {
                authenticate: authenticateStub
            };
            return this;
        }
        return class_1;
    }());
    var GitHubSpy = sinon_1.spy(GitHub);
    registerSuite('tasks/setup', {
        beforeEach: function () {
            registerMultiTaskStub = sinon_1.stub(grunt, 'registerMultiTask');
            setup = loadModule_1.default(require, '../../../tasks/setup', {
                './util/wrapAsyncTask': { default: wrapAsyncTaskStub },
                '../src/util/GitHub': { default: GitHubSpy },
                './util/getGithubSlug': { default: getGithubSlugStub },
                '../src/commands/initialize/initDeployment': { default: initDeploymentStub },
                '../src/commands/initialize/initAuthorization': { default: initAuthorizationStub }
            });
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        afterEach: function () {
            getGithubSlugStub.reset();
            authenticateStub.reset();
            initDeploymentStub.reset();
            initAuthorizationStub.reset();
            wrapAsyncTaskStub.reset();
            optionsStub.reset();
            GitHubSpy.reset();
            registerMultiTaskStub.restore();
        },
        tests: {
            'setup calls initDeployment and initAuthorization; eventually resolves': function () {
                var deferred = this.async();
                var counter = 0;
                getGithubSlugStub.returns({ name: 'name', owner: 'owner' });
                optionsStub.returns({ password: 'password', username: 'username' });
                wrapAsyncTaskStub.callsFake(function (task) {
                    task.call({ options: optionsStub }).then(deferred.rejectOnError(function () {
                        if (counter >= 1) {
                            assert.isTrue(optionsStub.calledTwice);
                            assert.isTrue(registerMultiTaskStub.calledTwice);
                            assert.isTrue(getGithubSlugStub.calledTwice);
                            assert.isTrue(GitHubSpy.calledTwice);
                            assert.isTrue(initDeploymentStub.calledOnce);
                            assert.isTrue(initAuthorizationStub.calledOnce);
                            deferred.resolve();
                        }
                        counter++;
                    }));
                });
                setup(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledTwice);
            }
        }
    });
});
//# sourceMappingURL=setup.js.map