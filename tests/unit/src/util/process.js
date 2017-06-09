var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "sinon", "../../../_support/loadModule", "src/util/process", "src/log", "../../../_support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var sinon_1 = require("sinon");
    var loadModule_1 = require("../../../_support/loadModule");
    var processUtil = require("src/util/process");
    var log_1 = require("src/log");
    var util_1 = require("../../../_support/util");
    var module;
    var execStub;
    var spawnStub;
    registerSuite({
        name: 'util/process',
        before: function () {
            execStub = sinon_1.stub();
            spawnStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            module = loadModule_1.default('src/util/process', {
                child_process: {
                    exec: execStub,
                    spawn: spawnStub
                }
            });
        },
        afterEach: function () {
            execStub.reset();
            spawnStub.reset();
        },
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
                'eventually resolves the returned promise': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var promise, _a, _b, _c;
                        return __generator(this, function (_d) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var proc, promise, _a, _b, _c;
                    return __generator(this, function (_d) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var proc, promise, _a, _b, _c;
                    return __generator(this, function (_d) {
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
    });
});
//# sourceMappingURL=process.js.map