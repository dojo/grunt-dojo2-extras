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
        define(["require", "exports", "intern!object", "intern/chai!assert", "../../../_support/loadModule", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var sync;
    var GitSpy;
    var checkoutStub;
    var isInitializedStub;
    var syncOptions = {
        branch: 'master',
        cloneDirectory: 'dir',
        url: 'http://web.site'
    };
    registerSuite({
        name: 'commands/sync',
        before: function () {
            checkoutStub = sinon_1.stub();
            isInitializedStub = sinon_1.stub();
            var Git = (function () {
                function class_1() {
                    this.assert = sinon_1.stub();
                    this.checkout = checkoutStub;
                    this.clone = sinon_1.stub();
                    this.createOrphan = sinon_1.stub();
                    this.ensureConfig = sinon_1.stub();
                    this.isInitialized = isInitializedStub;
                    this.pull = sinon_1.stub();
                }
                return class_1;
            }());
            GitSpy = sinon_1.spy(Git);
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            sync = loadModule_1.default('src/commands/sync', {
                '../util/Git': { default: GitSpy }
            });
        },
        afterEach: function () {
            GitSpy.reset();
            checkoutStub.reset();
            isInitializedStub.reset();
        },
        sync: (function () {
            return {
                'Git initialized; checkout eventually resolves': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var git;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    checkoutStub.returns(Promise.resolve('master'));
                                    isInitializedStub.returns(true);
                                    return [4, assertSync()];
                                case 1:
                                    _a.sent();
                                    git = GitSpy.lastCall.returnValue;
                                    assert.isTrue(git.assert.calledOnce);
                                    assert.isTrue(git.pull.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'Git not initialized; checkout eventually resolves': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var git;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    checkoutStub.returns(Promise.resolve());
                                    isInitializedStub.returns(false);
                                    return [4, assertSync()];
                                case 1:
                                    _a.sent();
                                    git = GitSpy.lastCall.returnValue;
                                    assert.isTrue(git.clone.calledOnce);
                                    assert.isTrue(git.pull.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'Git checkout eventually rejects': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var git;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    checkoutStub.returns(Promise.reject(undefined));
                                    isInitializedStub.returns(true);
                                    return [4, assertSync()];
                                case 1:
                                    _a.sent();
                                    git = GitSpy.lastCall.returnValue;
                                    assert.isTrue(git.createOrphan.calledOnce);
                                    return [2];
                            }
                        });
                    });
                }
            };
            function assertSync() {
                return __awaiter(this, void 0, void 0, function () {
                    var git;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, sync(syncOptions)];
                            case 1:
                                _a.sent();
                                git = GitSpy.lastCall.returnValue;
                                assert.isTrue(GitSpy.calledOnce);
                                assert.isTrue(git.ensureConfig.calledOnce);
                                assert.isTrue(git.isInitialized.calledOnce);
                                assert.isTrue(git.checkout.calledOnce);
                                return [2];
                        }
                    });
                });
            }
        })()
    });
});
//# sourceMappingURL=sync.js.map