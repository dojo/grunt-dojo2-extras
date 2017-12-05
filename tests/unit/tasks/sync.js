(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "grunt", "sinon", "../../_support/loadModule", "../../_support/tasks"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var grunt = require("grunt");
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../_support/loadModule");
    var tasks_1 = require("../../_support/tasks");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var sync;
    var registerMultiTaskStub;
    var getGithubSlugStub = sinon_1.stub();
    var syncStub = sinon_1.stub();
    var getConfigStub = sinon_1.stub();
    var wrapAsyncTaskStub = sinon_1.stub();
    var optionsStub = sinon_1.stub();
    var Git = (function () {
        function class_1() {
            this.getConfig = getConfigStub;
        }
        return class_1;
    }());
    var GitHub = (function () {
        function class_2() {
            return this;
        }
        return class_2;
    }());
    var GitSpy = sinon_1.spy(Git);
    var GitHubSpy = sinon_1.spy(GitHub);
    registerSuite('tasks/sync', {
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            registerMultiTaskStub = sinon_1.stub(grunt, 'registerMultiTask');
            optionsStub.returns({});
            sync = loadModule_1.default(require, '../../../tasks/sync', {
                '../src/commands/sync': { default: syncStub },
                './util/wrapAsyncTask': { default: wrapAsyncTaskStub },
                './util/getGithubSlug': { default: getGithubSlugStub },
                '../src/util/GitHub': { default: GitHubSpy },
                '../src/util/Git': { default: GitSpy }
            });
        },
        afterEach: function () {
            syncStub.reset();
            getGithubSlugStub.reset();
            GitSpy.reset();
            GitHubSpy.reset();
            getConfigStub.reset();
            wrapAsyncTaskStub.reset();
            optionsStub.reset();
            registerMultiTaskStub.restore();
        },
        tests: {
            'syncTask uses GitHub repo info, calls sync; eventually resolves': function () {
                getGithubSlugStub.returns({ name: 'name', owner: 'owner' });
                syncStub.returns(Promise.resolve());
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(registerMultiTaskStub.calledOnce);
                    assert.isTrue(getGithubSlugStub.calledOnce);
                    assert.isTrue(GitHubSpy.calledOnce);
                    assert.isTrue(syncStub.calledOnce);
                });
                sync(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
            },
            'syncTask uses git repo url; eventually resolves': function () {
                getConfigStub.returns(Promise.resolve('repo.url'));
                getGithubSlugStub.returns({});
                syncStub.returns(Promise.resolve());
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(registerMultiTaskStub.calledOnce);
                    assert.isTrue(wrapAsyncTaskStub.calledOnce);
                    assert.isTrue(GitSpy.calledOnce);
                    assert.isTrue(getConfigStub.calledOnce);
                    assert.isTrue(syncStub.calledOnce);
                });
                sync(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
            },
            'syncTask has url in options; eventually resolves': function () {
                optionsStub.returns({ url: 'options.url' });
                syncStub.returns(Promise.resolve());
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(registerMultiTaskStub.calledOnce);
                    assert.isTrue(wrapAsyncTaskStub.calledOnce);
                    assert.isTrue(getGithubSlugStub.notCalled);
                    assert.isTrue(syncStub.calledOnce);
                });
                sync(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
            }
        }
    });
});
//# sourceMappingURL=sync.js.map