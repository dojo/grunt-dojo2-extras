(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "sinon", "../../../_support/loadModule", "../../../_support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../../_support/loadModule");
    var util_1 = require("../../../_support/util");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var doneStub = sinon_1.stub();
    var taskStub = sinon_1.stub();
    var loggerStub = { error: sinon_1.stub() };
    var wrapAsyncTask;
    registerSuite('tasks/util/wrapAsyncTask', {
        afterEach: function () {
            doneStub.reset();
            taskStub.reset();
            loggerStub.error.reset();
        },
        before: function () {
            wrapAsyncTask = loadModule_1.default(require, '../../../../tasks/util/wrapAsyncTask', {
                '../../src/log': { logger: loggerStub }
            });
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        tests: {
            'task eventually': (function () {
                function runWrapAsyncTaskTest(promise, callback, errback) {
                    taskStub.returns(promise);
                    sinon_1.stub(this, 'async').returns(doneStub);
                    wrapAsyncTask(taskStub).call(this);
                    this.async.restore();
                    return promise.then(callback, errback);
                }
                return {
                    'completes': function () {
                        var taskPromise = Promise.resolve();
                        var callbackAssert = function () {
                            assert.isTrue(loggerStub.error.notCalled);
                            assert.isTrue(doneStub.calledWithExactly(undefined));
                        };
                        return runWrapAsyncTaskTest.call(this, taskPromise, callbackAssert);
                    },
                    'rejects': function () {
                        var taskPromise = Promise.reject(undefined);
                        var errbackAssert = function () {
                            assert.isTrue(loggerStub.error.notCalled);
                            assert.isTrue(doneStub.calledWithExactly(false));
                        };
                        return runWrapAsyncTaskTest.call(this, taskPromise, util_1.throwWithError('Should reject when task fails'), errbackAssert);
                    },
                    'reject; logs error messages': function () {
                        var taskPromise = Promise.reject({ message: 'error message' });
                        var errbackAssert = function () {
                            assert.isTrue(loggerStub.error.calledWith('error message'));
                            assert.isTrue(doneStub.calledWithExactly(false));
                        };
                        return runWrapAsyncTaskTest.call(this, taskPromise, util_1.throwWithError('Should reject when task fails'), errbackAssert);
                    }
                };
            })()
        }
    });
});
//# sourceMappingURL=wrapAsyncTask.js.map