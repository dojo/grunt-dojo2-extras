(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "grunt", "sinon", "../../_support/loadModule", "../../_support/tasks"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var grunt = require("grunt");
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../_support/loadModule");
    var tasks_1 = require("../../_support/tasks");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var prebuild;
    var registerTaskStub;
    var wrapAsyncTaskStub = sinon_1.stub();
    var decryptDeployKeyStub = sinon_1.stub();
    var loggerStub = { info: sinon_1.stub() };
    registerSuite('tasks/prebuild', {
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            registerTaskStub = sinon_1.stub(grunt, 'registerTask');
            prebuild = loadModule_1.default(require, '../../../tasks/prebuild', {
                './util/wrapAsyncTask': { default: wrapAsyncTaskStub },
                '../src/commands/decryptDeployKey': { default: decryptDeployKeyStub },
                '../src/log': { logger: loggerStub }
            });
        },
        afterEach: function () {
            wrapAsyncTaskStub.reset();
            decryptDeployKeyStub.reset();
            loggerStub.info.reset();
            registerTaskStub.restore();
        },
        tests: {
            'decryptDeployKey': (function () {
                function assertInWrappedAsyncStub(test, shouldLog) {
                    tasks_1.setupWrappedAsyncStub(wrapAsyncTaskStub, test.async(), function () {
                        assert.isTrue(registerTaskStub.calledOnce);
                        assert.isTrue(decryptDeployKeyStub.calledOnce);
                        if (shouldLog) {
                            assert.isTrue(loggerStub.info.calledWith('Decrypted deploy key'), 'Should have logged that the key was decrypted');
                        }
                        else {
                            assert.isTrue(loggerStub.info.notCalled, 'Should not have logged that the key was decrypted');
                        }
                    });
                }
                function testPrebuild(test, wasDecryptionSuccessful) {
                    assertInWrappedAsyncStub(test, wasDecryptionSuccessful);
                    decryptDeployKeyStub.returns(Promise.resolve(wasDecryptionSuccessful));
                    prebuild(grunt);
                    assert.isTrue(wrapAsyncTaskStub.calledOnce);
                }
                return {
                    'successful decryption': function () {
                        testPrebuild(this, true);
                    },
                    'decryption failed': function () {
                        testPrebuild(this, false);
                    }
                };
            })()
        }
    });
});
//# sourceMappingURL=prebuild.js.map