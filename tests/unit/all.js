(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./src/log", "./src/commands/getReleases", "./src/commands/installDependencies", "./src/util/crypto", "./src/util/environment", "./src/util/file", "./src/util/Git", "./src/util/GitHub", "./src/util/streams", "./tasks/util/getGithubSlug"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("./src/log");
    require("./src/commands/getReleases");
    require("./src/commands/installDependencies");
    require("./src/util/crypto");
    require("./src/util/environment");
    require("./src/util/file");
    require("./src/util/Git");
    require("./src/util/GitHub");
    require("./src/util/streams");
    require("./tasks/util/getGithubSlug");
});
//# sourceMappingURL=all.js.map