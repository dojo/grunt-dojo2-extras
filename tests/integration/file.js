(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../src/util/file", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var file_1 = require("../../src/util/file");
    var fs_1 = require("fs");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    registerSuite('file', {
        tempDirectory: function () {
            var path = file_1.makeTempDirectory('.test');
            assert.isTrue(fs_1.existsSync(path));
            assert.isTrue(fs_1.statSync(path).isDirectory());
        }
    });
});
//# sourceMappingURL=file.js.map