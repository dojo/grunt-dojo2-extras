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
    function setupWrappedAsyncStub(stub, dfd, callback) {
        var _this = this;
        stub.callsFake(function (task) {
            task.call(_this).then(dfd.callback(callback));
        });
    }
    exports.setupWrappedAsyncStub = setupWrappedAsyncStub;
});
//# sourceMappingURL=tasks.js.map