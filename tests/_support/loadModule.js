(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mockery", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mockery = require("mockery");
    var tslib = require("tslib");
    function loadModule(require, mid, mocks, returnDefault) {
        if (returnDefault === void 0) { returnDefault = true; }
        var moduleUnderTestPath = require.resolve(mid);
        mockery.enable({
            useCleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.resetCache();
        for (var mid_1 in mocks) {
            mockery.registerMock(mid_1, mocks[mid_1]);
        }
        mockery.registerMock('tslib', tslib);
        var module = require(moduleUnderTestPath);
        return returnDefault && module.default ? module.default : module;
    }
    exports.default = loadModule;
    function cleanupModuleMocks() {
        mockery.deregisterAll();
        mockery.disable();
    }
    exports.cleanupModuleMocks = cleanupModuleMocks;
});
//# sourceMappingURL=loadModule.js.map