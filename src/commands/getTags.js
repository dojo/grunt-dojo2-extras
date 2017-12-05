(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "semver", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var semver = require("semver");
    var fs_1 = require("fs");
    var path_1 = require("path");
    function getHtmlApiPath(base, project, version) {
        return path_1.join(base, project + "/" + version);
    }
    exports.getHtmlApiPath = getHtmlApiPath;
    function getJsonApiPath(base, project, version) {
        return path_1.join(base, project + "-" + version + ".json");
    }
    exports.getJsonApiPath = getJsonApiPath;
    function createHtmlApiMissingFilter(project, directory) {
        return function (tag) {
            return !fs_1.existsSync(getHtmlApiPath(directory, project, tag.name));
        };
    }
    exports.createHtmlApiMissingFilter = createHtmlApiMissingFilter;
    function createJsonApiMissingFilter(project, directory) {
        return function (tag) {
            return !fs_1.existsSync(getJsonApiPath(directory, project, tag.name));
        };
    }
    exports.createJsonApiMissingFilter = createJsonApiMissingFilter;
    function latestFilter(_tag, index, array) {
        return index === array.length - 1;
    }
    exports.latestFilter = latestFilter;
    function createVersionFilter(comp) {
        return function (tag) {
            var version = semver.clean(tag.name);
            return semver.satisfies(version, comp);
        };
    }
    exports.createVersionFilter = createVersionFilter;
    function getTags(repo, filters) {
        if (filters === void 0) { filters = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, repo.fetchTags()];
                    case 1: return [2, (_a.sent())
                            .filter(function (tag) {
                            return semver.clean(tag.name);
                        })
                            .sort(function (a, b) {
                            var left = semver.clean(a.name);
                            var right = semver.clean(b.name);
                            return semver.compare(left, right, true);
                        })
                            .filter(function (tag, index, array) {
                            for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                                var filter = filters_1[_i];
                                if (!filter(tag, index, array)) {
                                    return false;
                                }
                            }
                            return true;
                        })];
                }
            });
        });
    }
    exports.default = getTags;
});
//# sourceMappingURL=getTags.js.map