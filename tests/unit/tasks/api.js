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
    var api;
    var registerMultiTaskStub;
    var typedocStub = sinon_1.stub();
    var syncStub = sinon_1.stub();
    var getTagsStub = sinon_1.stub();
    var createHtmlApiMissingFilterStub = sinon_1.stub();
    var createJsonApiMissingFilterStub = sinon_1.stub();
    var createVersionFilterStub = sinon_1.stub();
    var getHtmlApiPathStub = sinon_1.stub();
    var getJsonApiPathStub = sinon_1.stub();
    var latestFilterStub = sinon_1.stub();
    var joinStub = sinon_1.stub();
    var resolveStub = sinon_1.stub();
    var installDependenciesStub = sinon_1.stub();
    var makeTempDirectoryStub = sinon_1.stub();
    var wrapAsyncTaskStub = sinon_1.stub();
    var optionsStub = sinon_1.stub();
    var GitHub = (function () {
        function class_1(owner, name) {
            this.name = name;
            this.url = "https://github.com/" + owner + "/" + name;
            return this;
        }
        return class_1;
    }());
    var GitHubSpy = sinon_1.spy(GitHub);
    registerSuite('tasks/api', {
        beforeEach: function () {
            api = loadModule_1.default(require, '../../../tasks/api', {
                '../src/commands/typedoc': { default: typedocStub },
                './util/wrapAsyncTask': { default: wrapAsyncTaskStub },
                '../src/util/GitHub': { default: GitHubSpy },
                '../src/commands/sync': { default: syncStub },
                '../src/commands/getTags': {
                    default: getTagsStub,
                    createHtmlApiMissingFilter: createHtmlApiMissingFilterStub,
                    createJsonApiMissingFilter: createJsonApiMissingFilterStub,
                    createVersionFilter: createVersionFilterStub,
                    getHtmlApiPath: getHtmlApiPathStub,
                    getJsonApiPath: getJsonApiPathStub,
                    latestFilter: latestFilterStub
                },
                'path': {
                    join: joinStub,
                    resolve: resolveStub
                },
                '../src/commands/installDependencies': { default: installDependenciesStub },
                '../src/util/file': { makeTempDirectory: makeTempDirectoryStub }
            });
            registerMultiTaskStub = sinon_1.stub(grunt, 'registerMultiTask');
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        afterEach: function () {
            typedocStub.reset();
            GitHubSpy.reset();
            syncStub.reset();
            getTagsStub.reset();
            createHtmlApiMissingFilterStub.reset();
            createJsonApiMissingFilterStub.reset();
            createVersionFilterStub.reset();
            getHtmlApiPathStub.reset();
            getJsonApiPathStub.reset();
            latestFilterStub.reset();
            joinStub.reset();
            resolveStub.reset();
            installDependenciesStub.reset();
            makeTempDirectoryStub.reset();
            wrapAsyncTaskStub.reset();
            optionsStub.reset();
            registerMultiTaskStub.restore();
        },
        tests: {
            'api task has remote options including html format and string repo; no missing filters, no APIs match; eventually resolves': function () {
                getTagsStub.returns([]);
                optionsStub.returns({
                    src: 'src',
                    dest: 'dest',
                    format: 'html',
                    repo: 'user/repo',
                    cloneDirectory: 'cloneDirectory',
                    filter: 'filter',
                    skipInstall: true,
                    typedoc: {}
                });
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(optionsStub.calledOnce);
                    assert.isTrue(GitHubSpy.calledOnce);
                    assert.isTrue(joinStub.notCalled);
                    assert.isTrue(makeTempDirectoryStub.notCalled);
                    assert.isTrue(createVersionFilterStub.calledOnce);
                    assert.isTrue(createHtmlApiMissingFilterStub.calledOnce);
                    assert.isTrue(getTagsStub.calledOnce);
                    assert.isTrue(getHtmlApiPathStub.notCalled);
                });
                api(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
                assert.isTrue(registerMultiTaskStub.calledOnce);
            },
            'api task has remote options including json format and object repo; no filters, all APIs up to date; eventually resolves': function () {
                getTagsStub.returns([]);
                optionsStub.returns({
                    src: 'src',
                    dest: 'dest',
                    format: 'json',
                    repo: { owner: 'user', name: 'repo' },
                    skipInstall: true,
                    typedoc: {}
                });
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(optionsStub.calledOnce);
                    assert.isTrue(GitHubSpy.calledOnce);
                    assert.isTrue(joinStub.calledOnce);
                    assert.isTrue(makeTempDirectoryStub.calledOnce);
                    assert.isTrue(createVersionFilterStub.notCalled);
                    assert.isTrue(createJsonApiMissingFilterStub.calledOnce);
                    assert.isTrue(getTagsStub.calledOnce);
                    assert.isTrue(getJsonApiPathStub.notCalled);
                });
                api(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
                assert.isTrue(registerMultiTaskStub.calledOnce);
            },
            'api task has remote options including json format and object repo; latest filters, all APIs up to date; eventually resolves': function () {
                getTagsStub.returns([{ name: 'name' }]);
                optionsStub.returns({
                    src: 'src',
                    dest: 'dest',
                    format: 'json',
                    repo: { owner: 'user', name: 'repo' },
                    filter: 'latest',
                    skipInstall: true,
                    typedoc: {}
                });
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(optionsStub.calledOnce);
                    assert.isTrue(GitHubSpy.calledOnce);
                    assert.isTrue(joinStub.calledOnce);
                    assert.isTrue(makeTempDirectoryStub.calledOnce);
                    assert.isTrue(createVersionFilterStub.notCalled);
                    assert.isTrue(createJsonApiMissingFilterStub.calledOnce);
                    assert.isTrue(getTagsStub.calledOnce);
                    assert.isTrue(getJsonApiPathStub.calledOnce);
                    assert.isTrue(syncStub.calledOnce);
                    assert.isTrue(installDependenciesStub.notCalled);
                    assert.isTrue(typedocStub.calledOnce);
                });
                api(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
                assert.isTrue(registerMultiTaskStub.calledOnce);
            },
            'api task has remote options including filter object; runs installDependencies; eventually resolves': function () {
                getTagsStub.returns([{ name: 'name' }]);
                optionsStub.returns({
                    src: 'src',
                    dest: 'dest',
                    format: 'html',
                    repo: { owner: 'user', name: 'repo' },
                    filter: {},
                    skipInstall: false,
                    typedoc: {}
                });
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(optionsStub.calledOnce);
                    assert.isTrue(GitHubSpy.calledOnce);
                    assert.isTrue(joinStub.calledOnce);
                    assert.isTrue(makeTempDirectoryStub.calledOnce);
                    assert.isTrue(createVersionFilterStub.notCalled);
                    assert.isTrue(createHtmlApiMissingFilterStub.calledOnce);
                    assert.isTrue(getTagsStub.calledOnce);
                    assert.isTrue(getHtmlApiPathStub.calledOnce);
                    assert.isTrue(syncStub.calledOnce);
                    assert.isTrue(installDependenciesStub.calledOnce);
                    assert.isTrue(typedocStub.calledOnce);
                });
                api(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
                assert.isTrue(registerMultiTaskStub.calledOnce);
            },
            'api task has remote options; runs installDependencies; eventually resolves': function () {
                getTagsStub.returns([{ name: 'name' }]);
                optionsStub.returns({
                    src: 'src',
                    dest: 'dest',
                    format: 'html',
                    repo: { owner: 'user', name: 'repo' },
                    filter: [],
                    skipInstall: false,
                    typedoc: {}
                });
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(optionsStub.calledOnce);
                    assert.isTrue(GitHubSpy.calledOnce);
                    assert.isTrue(joinStub.calledOnce);
                    assert.isTrue(makeTempDirectoryStub.calledOnce);
                    assert.isTrue(createVersionFilterStub.notCalled);
                    assert.isTrue(createHtmlApiMissingFilterStub.calledOnce);
                    assert.isTrue(getTagsStub.calledOnce);
                    assert.isTrue(getHtmlApiPathStub.calledOnce);
                    assert.isTrue(syncStub.calledOnce);
                    assert.isTrue(installDependenciesStub.calledOnce);
                    assert.isTrue(typedocStub.calledOnce);
                });
                api(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
                assert.isTrue(registerMultiTaskStub.calledOnce);
            },
            'api task has no remote options; eventually resolves': function () {
                optionsStub.returns({
                    src: 'src',
                    dest: 'dest',
                    format: 'html',
                    skipInstall: true,
                    typedoc: {}
                });
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(optionsStub.calledOnce);
                    assert.isTrue(resolveStub.calledOnce);
                    assert.isTrue(typedocStub.calledOnce);
                });
                api(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
                assert.isTrue(registerMultiTaskStub.calledOnce);
            },
            'api task has no remote options; runs installDependencies; eventually resolves': function () {
                optionsStub.returns({
                    src: 'src',
                    dest: 'dest',
                    format: 'html',
                    skipInstall: false,
                    typedoc: {}
                });
                tasks_1.setupWrappedAsyncStub.call({
                    options: optionsStub
                }, wrapAsyncTaskStub, this.async(), function () {
                    assert.isTrue(optionsStub.calledOnce);
                    assert.isTrue(installDependenciesStub.calledOnce);
                    assert.isTrue(resolveStub.calledOnce);
                    assert.isTrue(typedocStub.calledOnce);
                });
                api(grunt);
                assert.isTrue(wrapAsyncTaskStub.calledOnce);
                assert.isTrue(registerMultiTaskStub.calledOnce);
            }
        }
    });
});
//# sourceMappingURL=api.js.map