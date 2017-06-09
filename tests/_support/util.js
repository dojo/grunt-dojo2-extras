(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function throwWithError(errorMessage) {
        if (errorMessage === void 0) { errorMessage = 'Unexpected code path'; }
        return function () {
            throw new Error(errorMessage);
        };
    }
    exports.throwWithError = throwWithError;
});
//# sourceMappingURL=util.js.map