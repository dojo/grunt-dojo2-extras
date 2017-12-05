(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../log", "path", "../util/process", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var log_1 = require("../log");
    var path_1 = require("path");
    var process_1 = require("../util/process");
    var fs_1 = require("fs");
    function installDependencies(dir) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var typingsJson;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.logger.info('Installing dependencies');
                        typingsJson = path_1.join(dir, 'typings.json');
                        return [4, process_1.promiseExec('npm install', { silent: false, cwd: dir })];
                    case 1:
                        _a.sent();
                        if (!fs_1.existsSync(typingsJson)) return [3, 3];
                        return [4, process_1.promiseExec('typings install', { silent: false, cwd: dir })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2, typingsJson];
                }
            });
        });
    }
    exports.default = installDependencies;
});
//# sourceMappingURL=installDependencies.js.map