(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../src/commands/typedoc", "./util/wrapAsyncTask", "../src/util/GitHub", "../src/commands/sync", "../src/commands/getTags", "path", "../src/commands/installDependencies", "../src/log", "../src/util/file", "@dojo/shim/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    var tslib_1 = require("tslib");
    var typedoc_1 = require("../src/commands/typedoc");
    var wrapAsyncTask_1 = require("./util/wrapAsyncTask");
    var GitHub_1 = require("../src/util/GitHub");
    var sync_1 = require("../src/commands/sync");
    var getTags_1 = require("../src/commands/getTags");
    var path_1 = require("path");
    var installDependencies_1 = require("../src/commands/installDependencies");
    var log_1 = require("../src/log");
    var file_1 = require("../src/util/file");
    require("@dojo/shim/Promise");
    function isRemoteOptions(options) {
        return !!options.repo;
    }
    function getGitHub(repo) {
        if (typeof repo === 'string') {
            var _a = repo.split('/'), owner = _a[0], name_1 = _a[1];
            return new GitHub_1.default(owner, name_1);
        }
        else {
            return new GitHub_1.default(repo.owner, repo.name);
        }
    }
    function getMissing(repo, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var filters;
            return tslib_1.__generator(this, function (_a) {
                filters = getFilterOptions(options.filter);
                if (options.format === 'json') {
                    filters.push(getTags_1.createJsonApiMissingFilter(repo.name, options.dest));
                }
                else {
                    filters.push(getTags_1.createHtmlApiMissingFilter(repo.name, options.dest));
                }
                return [2, getTags_1.default(repo, filters)];
            });
        });
    }
    function getFilterOptions(filter) {
        if (!filter) {
            return [];
        }
        if (filter === 'latest') {
            return [getTags_1.latestFilter];
        }
        if (typeof filter === 'string') {
            return [getTags_1.createVersionFilter(filter)];
        }
        if (Array.isArray(filter)) {
            return filter;
        }
        return [filter];
    }
    return function (grunt) {
        function typedocTask() {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var options, src, dest, format, repo, cloneDirectory, missing, pathTemplate, _i, missing_1, release, target;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = this.options({
                                format: 'html',
                                typedoc: {
                                    mode: 'file',
                                    externalPattern: '**/+(example|examples|node_modules|tests|typings)/**/*.ts',
                                    excludeExternals: true,
                                    excludeNotExported: true,
                                    ignoreCompilerErrors: true
                                }
                            });
                            src = options.src, dest = options.dest, format = options.format;
                            if (!isRemoteOptions(options)) return [3, 9];
                            repo = getGitHub(options.repo);
                            cloneDirectory = options.cloneDirectory ?
                                options.cloneDirectory : file_1.makeTempDirectory(path_1.join('.sync', repo.name));
                            return [4, getMissing(repo, options)];
                        case 1:
                            missing = _a.sent();
                            pathTemplate = format === 'json' ? getTags_1.getJsonApiPath : getTags_1.getHtmlApiPath;
                            if (missing.length === 0) {
                                if (options.filter) {
                                    log_1.logger.info("No APIs match the filter: \"" + options.filter);
                                }
                                else {
                                    log_1.logger.info("all APIs are up-to-date.");
                                }
                                return [2];
                            }
                            _i = 0, missing_1 = missing;
                            _a.label = 2;
                        case 2:
                            if (!(_i < missing_1.length)) return [3, 8];
                            release = missing_1[_i];
                            target = pathTemplate(dest, repo.name, release.name);
                            return [4, sync_1.default({
                                    branch: release.name,
                                    cloneDirectory: cloneDirectory,
                                    url: repo.url
                                })];
                        case 3:
                            _a.sent();
                            if (!(options.skipInstall !== true)) return [3, 5];
                            return [4, installDependencies_1.default(cloneDirectory)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [4, typedoc_1.default(cloneDirectory, target, options.typedoc)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            _i++;
                            return [3, 2];
                        case 8: return [3, 13];
                        case 9:
                            if (!(options.skipInstall === false)) return [3, 11];
                            return [4, installDependencies_1.default(src)];
                        case 10:
                            _a.sent();
                            _a.label = 11;
                        case 11: return [4, typedoc_1.default(path_1.resolve(src), dest, options.typedoc)];
                        case 12:
                            _a.sent();
                            _a.label = 13;
                        case 13: return [2];
                    }
                });
            });
        }
        grunt.registerMultiTask('api', wrapAsyncTask_1.default(typedocTask));
    };
});
//# sourceMappingURL=api.js.map