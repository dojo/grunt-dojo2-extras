(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./util/wrapAsyncTask", "../src/util/GitHub", "./util/getGithubSlug", "../src/commands/initialize/initDeployment", "../src/commands/initialize/initAuthorization"], factory);
    }
})(function (require, exports) {
    "use strict";
    var tslib_1 = require("tslib");
    var wrapAsyncTask_1 = require("./util/wrapAsyncTask");
    var GitHub_1 = require("../src/util/GitHub");
    var getGithubSlug_1 = require("./util/getGithubSlug");
    var initDeployment_1 = require("../src/commands/initialize/initDeployment");
    var initAuthorization_1 = require("../src/commands/initialize/initAuthorization");
    function throws(message) {
        throw new Error(message);
    }
    function getGitHub(task, grunt) {
        var options = task.options({
            password: grunt.config.get('github.password'),
            username: grunt.config.get('github.username')
        });
        var _a = getGithubSlug_1.default(options, grunt), _b = _a.name, name = _b === void 0 ? throws('"repo" configuration invalid') : _b, _c = _a.owner, owner = _c === void 0 ? throws('"repo" configuration invalid') : _c;
        var repo = new GitHub_1.default(owner, name);
        repo.api.authenticate({
            type: 'basic',
            password: options.password,
            username: options.username
        });
        return repo;
    }
    return function (grunt) {
        function setupDeployment() {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var repo;
                return tslib_1.__generator(this, function (_a) {
                    repo = getGitHub(this, grunt);
                    return [2, initDeployment_1.default(repo)];
                });
            });
        }
        function setupAuthorization() {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var repo;
                return tslib_1.__generator(this, function (_a) {
                    repo = getGitHub(this, grunt);
                    return [2, initAuthorization_1.default(repo)];
                });
            });
        }
        grunt.registerMultiTask('setupDeploy', wrapAsyncTask_1.default(setupDeployment));
        grunt.registerMultiTask('setupAuth', wrapAsyncTask_1.default(setupAuthorization));
    };
});
//# sourceMappingURL=setup.js.map