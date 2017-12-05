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
    var publish;
    var gruntOptionStub;
    var Git = (function () {
        function class_1() {
        }
        return class_1;
    }());
    var GitSpy = sinon_1.spy(Git);
    var publishStub = sinon_1.stub();
    var hasGitCredentialsStub = sinon_1.stub();
    var publishModeStub = sinon_1.stub();
    var wrapAsyncTaskStub = sinon_1.stub();
    var optionsStub = sinon_1.stub();
    registerSuite('tasks/publish', {
        before: function () {
            publish = loadModule_1.default(require, '../../../tasks/publish', {
                '../src/commands/publish': { default: publishStub.returns(Promise.resolve()) },
                '../src/util/Git': { default: GitSpy },
                './util/wrapAsyncTask': { default: wrapAsyncTaskStub },
                '../src/util/environment': {
                    hasGitCredentials: hasGitCredentialsStub,
                    publishMode: publishModeStub
                }
            });
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            gruntOptionStub = sinon_1.stub(grunt, 'option');
            optionsStub.yieldsTo('publishMode').returns({
                cloneDirectory: 'cloneDirectory',
                publishMode: null,
                repo: null
            });
        },
        afterEach: function () {
            publishStub.reset();
            hasGitCredentialsStub.reset();
            publishModeStub.reset();
            GitSpy.reset();
            wrapAsyncTaskStub.reset();
            optionsStub.reset();
            gruntOptionStub.restore();
        },
        tests: {
            'publish task runs, has git credentials; eventually resolves': function () {
                gruntOptionStub.returns('publishMode');
                hasGitCredentialsStub.returns(true);
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(hasGitCredentialsStub.calledOnce, 'Should always check for git credentials');
                    assert.isTrue(GitSpy.calledOnce, 'Should always create a git utility');
                    assert.isTrue(publishStub.calledOnce, 'Should always call publish');
                    assert.isTrue(publishModeStub.calledOnce, 'Should call publishMode when there are git credentials');
                });
                publish(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
            },
            'publish task runs, has no git credentials; eventually resolves': function () {
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(hasGitCredentialsStub.calledOnce, 'Should always check for git credentials');
                    assert.isTrue(GitSpy.calledOnce, 'Should always create a git utility');
                    assert.isTrue(publishStub.calledOnce, 'Should always call publish');
                    assert.isTrue(publishModeStub.notCalled, 'Shouldn\'t call publish mode when there are no git credentials');
                });
                publish(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
            }
        }
    });
});
//# sourceMappingURL=publish.js.map