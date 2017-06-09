(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "sinon", "../../../_support/loadModule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../../_support/loadModule");
    var doneStub = sinon_1.stub();
    var taskStub = sinon_1.stub();
    var loggerStub = { error: sinon_1.stub() };
    var wrapAsyncTask;
    registerSuite({
        name: 'tasks/util/wrapAsyncTask',
        afterEach: function () {
            doneStub.reset();
            taskStub.reset();
            loggerStub.error.reset();
        },
        before: function () {
            wrapAsyncTask = loadModule_1.default('tasks/util/wrapAsyncTask', {
                '../../src/log': { logger: loggerStub }
            });
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
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
                    var taskPromise = Promise.reject();
                    var errbackAssert = function () {
                        assert.isTrue(loggerStub.error.notCalled);
                        assert.isTrue(doneStub.calledWithExactly(false));
                    };
                    return runWrapAsyncTaskTest.call(this, taskPromise, assert.fail, errbackAssert);
                },
                'reject; logs error messages': function () {
                    var taskPromise = Promise.reject({ message: 'error message' });
                    var errbackAssert = function () {
                        assert.isTrue(loggerStub.error.calledWith('error message'));
                        assert.isTrue(doneStub.calledWithExactly(false));
                    };
                    return runWrapAsyncTaskTest.call(this, taskPromise, assert.fail, errbackAssert);
                }
            };
        })()
    });
});
//# sourceMappingURL=wrapAsyncTask.js.map