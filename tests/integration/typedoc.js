(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../src/commands/typedoc", "../_support/tmpFiles", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var typedoc_1 = require("../../src/commands/typedoc");
    var tmpFiles_1 = require("../_support/tmpFiles");
    var fs_1 = require("fs");
    var path_1 = require("path");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    registerSuite('typedoc', {
        build: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var out, indexFile;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            out = tmpFiles_1.tmpDirectory();
                            return [4, typedoc_1.default(path_1.resolve('./assets/sample'), out)];
                        case 1:
                            _a.sent();
                            indexFile = fs_1.readFileSync(path_1.join(out, 'index.html'));
                            assert.include(String(indexFile), 'This is a README!');
                            return [2];
                    }
                });
            });
        }
    });
});
//# sourceMappingURL=typedoc.js.map