(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../_support/loadModule", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
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
    registerSuite('commands/typedoc', {
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
            typedoc = loadModule_1.default(require, '../../../../src/commands/typedoc', {
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
        tests: {
            'typedoc': (function () {
                return {
                    'opts.tsconfig is true': function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var isDirectoryStub;
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
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
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
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
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
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
        }
    });
});
//# sourceMappingURL=typedoc.js.map