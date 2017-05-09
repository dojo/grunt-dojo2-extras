(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "../../../_support/loadModule", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var module;
    var existsSyncStub;
    var mkdtempSyncStub;
    var mkdirpSyncStub;
    var joinStub;
    registerSuite({
        name: 'util/file',
        before: function () {
            existsSyncStub = sinon_1.stub();
            mkdtempSyncStub = sinon_1.stub();
            mkdirpSyncStub = sinon_1.stub();
            joinStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            module = loadModule_1.default('src/util/file', {
                'fs': {
                    existsSync: existsSyncStub,
                    mkdtempSync: mkdtempSyncStub
                },
                'mkdirp': {
                    sync: mkdirpSyncStub
                },
                'path': {
                    join: joinStub
                }
            });
        },
        afterEach: function () {
            existsSyncStub.reset();
            mkdtempSyncStub.reset();
            mkdirpSyncStub.reset();
            joinStub.reset();
        },
        makeTempDirectory: {
            'base directory does not exist; directory is created': function () {
                existsSyncStub.returns(false);
                module.makeTempDirectory('dir');
                assert.isTrue(existsSyncStub.calledOnce);
                assert.isTrue(mkdirpSyncStub.calledOnce);
            },
            'prefix not provided; defaults to "tmp-"': function () {
                existsSyncStub.returns(true);
                module.makeTempDirectory('dir');
                assert.isTrue(joinStub.calledWith('dir', 'tmp-'));
            },
            'value of mkdtempSync is returned': function () {
                existsSyncStub.returns(true);
                mkdtempSyncStub.returns('temp_dir');
                var tempDir = module.makeTempDirectory('dir', 'temp_');
                assert.isTrue(joinStub.calledWith('dir', 'temp_'));
                assert.isTrue(mkdtempSyncStub.calledOnce);
                assert.strictEqual(tempDir, 'temp_dir');
            }
        }
    });
});
//# sourceMappingURL=file.js.map