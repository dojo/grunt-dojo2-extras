(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "path", "mkdirp", "../log", "typedoc", "util", "fs", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var path_1 = require("path");
    var mkdirp_1 = require("mkdirp");
    var log_1 = require("../log");
    var typedoc_1 = require("typedoc");
    var util_1 = require("util");
    var fs_1 = require("fs");
    var typescript_1 = require("typescript");
    var Typedoc = (function (_super) {
        tslib_1.__extends(Typedoc, _super);
        function Typedoc() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Typedoc.prototype.bootstrap = function (options) {
            return this.bootstrapResult = _super.prototype.bootstrap.call(this, options);
        };
        Typedoc.prototype.generateJson = function (project, out) {
            mkdirp_1.sync(path_1.dirname(out));
            return _super.prototype.generateJson.call(this, project, out);
        };
        Typedoc.prototype.generateDocs = function (project, out) {
            mkdirp_1.sync(out);
            return _super.prototype.generateDocs.call(this, project, out);
        };
        return Typedoc;
    }(typedoc_1.Application));
    function setOptions(source, options) {
        options = Object.assign({
            module: 'umd',
            target: 'ES5'
        }, options);
        if (options.tsconfig !== false) {
            if (typeof options.tsconfig !== 'string') {
                var config = typescript_1.findConfigFile(source, fs_1.existsSync);
                options.tsconfig = config;
            }
        }
        else {
            delete options.tsconfig;
            if (fs_1.statSync(source).isDirectory()) {
                log_1.logger.warn('typedoc cannot parse a directory without a tsconfig.json');
            }
        }
        log_1.logger.debug("Typedoc Options " + util_1.inspect(options));
        return options;
    }
    function typedoc(source, target, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var doc, files;
            return tslib_1.__generator(this, function (_a) {
                log_1.logger.info("Building API Documentation for \"" + source + "\" to \"" + target + "\"");
                options = setOptions(source, options);
                doc = new Typedoc(options);
                files = doc.expandInputFiles(doc.bootstrapResult.inputFiles);
                log_1.logger.debug("Processing files " + util_1.inspect(files));
                if (path_1.extname(target) === '.json') {
                    doc.generateJson(files, target);
                }
                else {
                    doc.generateDocs(files, target);
                }
                return [2];
            });
        });
    }
    exports.default = typedoc;
});
//# sourceMappingURL=typedoc.js.map