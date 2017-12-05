(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../src/log", "../../../src/log", "winston"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var log = require("../../../src/log");
    var log_1 = require("../../../src/log");
    var winston_1 = require("winston");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var cachedTransports = {};
    registerSuite('log', {
        before: function () {
            for (var key in log.logger.transports) {
                cachedTransports[key] = log.logger.transports[key];
            }
            log.logger.clear();
        },
        after: function () {
            log.logger.clear();
            for (var key in cachedTransports) {
                log.logger.add(cachedTransports[key], {}, true);
            }
        },
        tests: {
            LogStream: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var memory, expected, stream;
                    return tslib_1.__generator(this, function (_a) {
                        memory = new winston_1.transports.Memory();
                        log.logger.add(memory, {}, true);
                        expected = 'Hello World';
                        stream = new log_1.LogStream();
                        stream.write(expected);
                        stream.end();
                        assert.strictEqual(memory.writeOutput[0], "info: " + expected);
                        return [2];
                    });
                });
            }
        }
    });
});
//# sourceMappingURL=log.js.map