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
    var typedoc;
    var TypedocSpy;
    var dirnameStub = sinon_1.stub();
    var expandInputFilesStub = sinon_1.stub();
    var extnameStub = sinon_1.stub();
    var findConfigFileStub = sinon_1.stub();
    var generateDocsStub = sinon_1.stub();
    var generateJsonStub = sinon_1.stub();
    var mkdirpStub = sinon_1.stub();
    var statSyncStub = sinon_1.stub();
    registerSuite({
        name: 'commands/typedoc',
        before: function () {
            var Typedoc = (function () {
                function class_1() {
                    this.bootstrapResult = { inputFiles: 'inputFiles' };
                    this.expandInputFiles = expandInputFilesStub;
                }
                class_1.prototype.generateDocs = function (project, out) {
                    return generateDocsStub(project, out);
                };
                class_1.prototype.generateJson = function (project, out) {
                    return generateJsonStub(project, out);
                };
                return class_1;
            }());
            TypedocSpy = sinon_1.spy(Typedoc);
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            typedoc = loadModule_1.default('src/commands/typedoc', {
                'path': {
                    dirname: dirnameStub,
                    extname: extnameStub
                },
                'mkdirp': {
                    sync: mkdirpStub
                },
                'typedoc': {
                    Application: TypedocSpy
                },
                'fs': {
                    statSync: statSyncStub
                },
                'typescript': {
                    findConfigFile: findConfigFileStub
                }
            });
        },
        afterEach: function () {
            dirnameStub.reset();
            expandInputFilesStub.reset();
            extnameStub.reset();
            findConfigFileStub.reset();
            generateDocsStub.reset();
            generateJsonStub.reset();
            mkdirpStub.reset();
            statSyncStub.reset();
            TypedocSpy.reset();
        },
        'typedoc': (function () {
            return {
                'opts.tsconfig is true': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    findConfigFileStub.returns('tsconfig');
                                    return [4, assertTypedoc('source', 'target', { tsconfig: true })];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(findConfigFileStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'opts.tsconfig is false': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var isDirectoryStub;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    isDirectoryStub = sinon_1.stub();
                                    statSyncStub.returns({ isDirectory: isDirectoryStub });
                                    return [4, assertTypedoc('source', 'target', { tsconfig: false })];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(isDirectoryStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'target is JSON': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    extnameStub.returns('.json');
                                    return [4, assertTypedoc('source', 'target.json', { tsconfig: true })];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(dirnameStub.calledOnce);
                                    assert.isTrue(generateJsonStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                },
                'target is not JSON': function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    extnameStub.returns('.file');
                                    return [4, assertTypedoc('source', 'target.file', { tsconfig: true })];
                                case 1:
                                    _a.sent();
                                    assert.isTrue(generateDocsStub.calledOnce);
                                    return [2];
                            }
                        });
                    });
                }
            };
            function assertTypedoc(source, target, opts) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, typedoc(source, target, opts)];
                            case 1:
                                _a.sent();
                                assert.isTrue(TypedocSpy.calledOnce);
                                assert.isTrue(expandInputFilesStub.calledOnce);
                                assert.isTrue(extnameStub.calledOnce);
                                assert.isTrue(mkdirpStub.calledOnce);
                                return [2];
                        }
                    });
                });
            }
        })()
    });
});
//# sourceMappingURL=typedoc.js.map