(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "grunt", "sinon", "../../_support/loadModule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var grunt = require("grunt");
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../_support/loadModule");
    var setup;
    var authenticateStub = sinon_1.stub();
    var getGithubSlugStub = sinon_1.stub();
    var initDeploymentStub = sinon_1.stub();
    var initAuthorizationStub = sinon_1.stub();
    var wrapAsyncTaskStub = sinon_1.stub();
    var optionsStub = sinon_1.stub();
    var registerMultiTaskStub = sinon_1.stub(grunt, 'registerMultiTask');
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
    registerSuite({
        name: 'tasks/setup',
        beforeEach: function () {
            setup = loadModule_1.default('tasks/setup', {
                './util/wrapAsyncTask': { default: wrapAsyncTaskStub },
                '../src/util/GitHub': { default: GitHubSpy },
                './util/getGithubSlug': { default: getGithubSlugStub },
                '../src/commands/initialize/initDeployment': { default: initDeploymentStub },
                '../src/commands/initialize/initAuthorization': { default: initAuthorizationStub }
            });
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
            registerMultiTaskStub.restore();
        },
        afterEach: function () {
            getGithubSlugStub.reset();
            authenticateStub.reset();
            initDeploymentStub.reset();
            initAuthorizationStub.reset();
            wrapAsyncTaskStub.reset();
            optionsStub.reset();
            GitHubSpy.reset();
            registerMultiTaskStub.reset();
        },
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
    });
});
//# sourceMappingURL=setup.js.map