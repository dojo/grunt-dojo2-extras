(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "path", "../../../_support/loadModule", "sinon", "../../../../src/commands/getTags"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var path = require("path");
    var loadModule_1 = require("../../../_support/loadModule");
    var sinon_1 = require("sinon");
    var getTags_1 = require("../../../../src/commands/getTags");
    var registerSuite = intern.getInterface('object').registerSuite;
    var assert = intern.getPlugin('chai').assert;
    var module;
    var existsSyncStub;
    function assertExistsFilter(builder, expected, filename) {
        var filter = builder('project', 'directory');
        existsSyncStub.returns(expected);
        assert.strictEqual(filter({ name: 'version' }), !expected);
        assert.isTrue(existsSyncStub.called, 'existSync was not called');
        assert.strictEqual(existsSyncStub.firstCall.args[0], filename);
    }
    registerSuite('getTags', {
        before: function () {
            existsSyncStub = sinon_1.stub();
        },
        after: function () {
            loadModule_1.cleanupModuleMocks();
        },
        beforeEach: function () {
            module = loadModule_1.default(require, '../../../../src/commands/getTags', {
                fs: {
                    existsSync: existsSyncStub
                }
            }, false);
        },
        afterEach: function () {
            existsSyncStub.reset();
        },
        tests: {
            getHtmlApiPath: function () {
                assert.strictEqual(getTags_1.getHtmlApiPath('base', 'project', 'version'), path.join('base', 'project', 'version'));
            },
            getJsonApiPath: function () {
                assert.strictEqual(getTags_1.getJsonApiPath('base', 'project', 'version'), path.join('base', 'project-version.json'));
            },
            filters: {
                createHtmlApiMissingFilter: {
                    'exists; returns false': function () {
                        var createHtmlApiMissingFilter = module.createHtmlApiMissingFilter;
                        assertExistsFilter(createHtmlApiMissingFilter, true, path.join('directory', 'project', 'version'));
                    },
                    'does not exist; returns true': function () {
                        var createHtmlApiMissingFilter = module.createHtmlApiMissingFilter;
                        assertExistsFilter(createHtmlApiMissingFilter, false, path.join('directory', 'project', 'version'));
                    }
                },
                createJsonApiMissingFilter: {
                    'exists; returns false': function () {
                        var createJsonApiMissingFilter = module.createJsonApiMissingFilter;
                        assertExistsFilter(createJsonApiMissingFilter, true, path.join('directory', 'project-version.json'));
                    },
                    'does not exist; returns true': function () {
                        var createJsonApiMissingFilter = module.createJsonApiMissingFilter;
                        assertExistsFilter(createJsonApiMissingFilter, false, path.join('directory', 'project-version.json'));
                    }
                },
                latestFilter: function () {
                    var latestFilter = module.latestFilter;
                    var list = ['one', 'two', 'three'];
                    assert.deepEqual(list.filter(latestFilter), ['three']);
                },
                createVersionFilter: {
                    'satisfies semver; returns true': function () {
                        var createVersionFilter = module.createVersionFilter;
                        var filter = createVersionFilter('>= 2.0.0');
                        assert.isTrue(filter({ name: '2.0.0' }));
                    },
                    'does not satisfy semver; returns false': function () {
                        var createVersionFilter = module.createVersionFilter;
                        var filter = createVersionFilter('< 2.0.0');
                        assert.isFalse(filter({ name: '2.0.0' }));
                    }
                }
            },
            getTags: (function () {
                var getTags;
                var mockGitHub;
                return {
                    before: function () {
                        getTags = module.default;
                        mockGitHub = {
                            fetchTags: function () {
                                return Promise.resolve([
                                    { name: 'one' },
                                    { name: '2.0.0' },
                                    { name: '1.6.5' },
                                    { name: '3.0.0-beta' }
                                ]);
                            }
                        };
                    },
                    tests: {
                        'removes version not compatible with semver': function () {
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var tags, expected;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, getTags(mockGitHub)];
                                        case 1:
                                            tags = _a.sent();
                                            expected = [
                                                { name: '1.6.5' },
                                                { name: '2.0.0' },
                                                { name: '3.0.0-beta' }
                                            ];
                                            assert.deepEqual(tags, expected);
                                            return [2];
                                    }
                                });
                            });
                        },
                        'applies filters': function () {
                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                var filter, tags, expected;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            filter = function (tag) {
                                                return tag.name === '2.0.0';
                                            };
                                            return [4, getTags(mockGitHub, [filter])];
                                        case 1:
                                            tags = _a.sent();
                                            expected = [
                                                { name: '2.0.0' }
                                            ];
                                            assert.deepEqual(tags, expected);
                                            return [2];
                                    }
                                });
                            });
                        }
                    }
                };
            })()
        }
    });
});
//# sourceMappingURL=getTags.js.map