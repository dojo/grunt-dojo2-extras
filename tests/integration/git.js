(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../src/util/Git", "../_support/tmpFiles"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Git_1 = require("../../src/util/Git");
    var tmpFiles_1 = require("../_support/tmpFiles");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    registerSuite('git', {
        build: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var out, repo;
                return tslib_1.__generator(this, function (_a) {
                    out = tmpFiles_1.tmpDirectory();
                    repo = new Git_1.default(out);
                    assert.isFalse(repo.isInitialized());
                    return [2];
                });
            });
        }
    });
});
//# sourceMappingURL=git.js.map