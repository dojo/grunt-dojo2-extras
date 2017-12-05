(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "sinon", "../../../_support/loadModule", "../../../../src/util/process", "../../../_support/util", "../../../../src/log"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../../_support/loadModule");
    var processUtil = require("../../../../src/util/process");
    var util_1 = require("../../../_support/util");
    var log_1 = require("../../../../src/log");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var module;
    var execStub;
    var spawnStub;
    registerSuite('util/process', {
        before: function () {
            execStub = sinon_1.stub();
            spawnStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            module = loadModule_1.default(require, '../../../../src/util/process', {
                child_process: {
                    exec: execStub,
                    spawn: spawnStub
                },
                '../log': {
                    logger: log_1.logger,
                    LogStream: log_1.LogStream
                }
            });
        },
        afterEach: function () {
            execStub.reset();
            spawnStub.reset();
        },
        tests: {
            promisify: (function () {
                var proc;
                return {
                    beforeEach: function () {
                        proc = {
                            stdout: { pipe: sinon_1.stub() },
                            stderr: { pipe: sinon_1.stub() },
                            on: sinon_1.stub()
                        };
                        sinon_1.stub(processUtil, 'exec').returns(proc);
                    },
                    afterEach: function () {
                        processUtil.exec.restore();
                    },
                    tests: {
                        'eventually resolves the returned promise': function () {
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var promise, _a, _b, _c;
                                return tslib_1.__generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            promise = processUtil.promisify(processUtil.exec('test'));
                                            proc.on.lastCall.args[1](0);
                                            _b = (_a = assert).equal;
                                            _c = [proc];
                                            return [4, promise];
                                        case 1:
                                            _b.apply(_a, _c.concat([_d.sent()]));
                                            return [2, promise];
                                    }
                                });
                            });
                        },
                        'child process exits with code other than 0; eventually rejects the returned promise': function () {
                            var promise;
                            promise = processUtil.promisify(processUtil.exec('test'));
                            proc.on.lastCall.args[1](1);
                            return promise.then(util_1.throwWithError('promise should reject'), function (e) {
                                assert.strictEqual(e.message, 'Process exited with a code of 1');
                                assert.strictEqual(process.exitCode, 1);
                            });
                        }
                    }
                };
            })(),
            exec: {
                'execChild is called, options not applied; execChild\'s value is returned': function () {
                    var value = 'ls';
                    execStub.returns(value);
                    var proc = module.exec(value, { silent: true });
                    assert.isTrue(execStub.calledOnce);
                    assert.strictEqual(proc, value);
                },
                'options applied after execChild is called': function () {
                    execStub.returns({
                        stdout: { pipe: sinon_1.stub() },
                        stderr: { pipe: sinon_1.stub() }
                    });
                    var proc = module.exec('ls', { silent: false });
                    assert.isTrue(proc.stdout.pipe.calledOnce);
                    assert.isTrue(proc.stderr.pipe.calledOnce);
                    assert.instanceOf(proc.stdout.pipe.lastCall.args[0], log_1.LogStream);
                    assert.instanceOf(proc.stderr.pipe.lastCall.args[0], log_1.LogStream);
                }
            },
            promiseExec: (function () {
                return {
                    'options not applied': function () {
                        var promise = testExec();
                        assert.equal(execStub.lastCall.args[1].silent, false);
                        return promise;
                    },
                    'options applied, options.silent = true': function () {
                        var promise = testExec({ silent: true });
                        assert.equal(execStub.lastCall.args[1].silent, true);
                        return promise;
                    },
                    'options applied, options.silent undefined': function () {
                        var promise = testExec({});
                        assert.equal(execStub.lastCall.args[1].silent, false);
                        return promise;
                    }
                };
                function testExec(opts) {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var proc, promise, _a, _b, _c;
                        return tslib_1.__generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    proc = {
                                        stdout: { pipe: sinon_1.stub() },
                                        stderr: { pipe: sinon_1.stub() },
                                        on: sinon_1.stub()
                                    };
                                    execStub.returns(proc);
                                    promise = module.promiseExec('test', opts);
                                    assert.isTrue(proc.on.called);
                                    assert.instanceOf(promise, Promise);
                                    assert.isTrue(proc.on.calledWith('close'));
                                    proc.on.lastCall.args[1](0);
                                    _b = (_a = assert).equal;
                                    _c = [proc];
                                    return [4, promise];
                                case 1:
                                    _b.apply(_a, _c.concat([_d.sent()]));
                                    return [2, promise];
                            }
                        });
                    });
                }
            })(),
            spawn: {
                'spawnChild is called, the return value of which is returned; options not applied': function () {
                    var value = 'ls';
                    spawnStub.returns(value);
                    var proc = module.spawn(value, ['-l'], { silent: true });
                    assert.isTrue(spawnStub.calledOnce);
                    assert.strictEqual(proc, value);
                },
                'options applied after spawnChild is called': function () {
                    spawnStub.returns({
                        stdout: { pipe: sinon_1.stub() },
                        stderr: { pipe: sinon_1.stub() }
                    });
                    var proc = module.spawn('ls', ['-l'], { silent: false });
                    assert.isTrue(proc.stdout.pipe.calledOnce);
                    assert.isTrue(proc.stderr.pipe.calledOnce);
                    assert.instanceOf(proc.stdout.pipe.lastCall.args[0], log_1.LogStream);
                    assert.instanceOf(proc.stderr.pipe.lastCall.args[0], log_1.LogStream);
                }
            },
            promiseSpawn: (function () {
                return {
                    'options not applied': function () {
                        var promise = testSpawn();
                        assert.equal(spawnStub.lastCall.args[2].silent, false);
                        return promise;
                    },
                    'options applied, options.silent = true': function () {
                        var promise = testSpawn({ silent: true });
                        assert.equal(spawnStub.lastCall.args[2].silent, true);
                        return promise;
                    },
                    'options applied, options.silent undefined': function () {
                        var promise = testSpawn({});
                        assert.equal(spawnStub.lastCall.args[2].silent, false);
                        return promise;
                    }
                };
                function testSpawn(opts) {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var proc, promise, _a, _b, _c;
                        return tslib_1.__generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    proc = {
                                        stdout: { pipe: sinon_1.stub() },
                                        stderr: { pipe: sinon_1.stub() },
                                        on: sinon_1.stub()
                                    };
                                    spawnStub.returns(proc);
                                    promise = module.promiseSpawn('test', ['arg'], opts);
                                    assert.isTrue(proc.on.called);
                                    assert.instanceOf(promise, Promise);
                                    assert.isTrue(proc.on.calledWith('close'));
                                    proc.on.lastCall.args[1](0);
                                    _b = (_a = assert).equal;
                                    _c = [proc];
                                    return [4, promise];
                                case 1:
                                    _b.apply(_a, _c.concat([_d.sent()]));
                                    return [2, promise];
                            }
                        });
                    });
                }
            })()
        }
    });
});
//# sourceMappingURL=process.js.map