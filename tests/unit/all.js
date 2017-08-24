(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./src/log", "./src/commands/decryptDeployKey", "./src/commands/getTags", "./src/commands/initialize/initDeployment", "./src/commands/initialize/initAuthorization", "./src/commands/initialize/createDeployKey", "./src/commands/typedoc", "./src/commands/publish", "./src/commands/installDependencies", "./src/commands/sync", "./src/util/crypto", "./src/util/environment", "./src/util/file", "./src/util/Git", "./tasks/api", "./tasks/setup", "./tasks/publish", "./tasks/prebuild", "./src/util/process", "./src/util/GitHub", "./src/util/Travis", "./src/util/streams", "./tasks/sync", "./tasks/util/getGithubSlug", "./tasks/util/wrapAsyncTask"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("./src/log");
    require("./src/commands/decryptDeployKey");
    require("./src/commands/getTags");
    require("./src/commands/initialize/initDeployment");
    require("./src/commands/initialize/initAuthorization");
    require("./src/commands/initialize/createDeployKey");
    require("./src/commands/typedoc");
    require("./src/commands/publish");
    require("./src/commands/installDependencies");
    require("./src/commands/sync");
    require("./src/util/crypto");
    require("./src/util/environment");
    require("./src/util/file");
    require("./src/util/Git");
    require("./tasks/api");
    require("./tasks/setup");
    require("./tasks/publish");
    require("./tasks/prebuild");
    require("./src/util/process");
    require("./src/util/GitHub");
    require("./src/util/Travis");
    require("./src/util/streams");
    require("./tasks/sync");
    require("./tasks/util/getGithubSlug");
    require("./tasks/util/wrapAsyncTask");
});
//# sourceMappingURL=all.js.map