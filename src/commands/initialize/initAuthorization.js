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
        define(["require", "exports", "../../util/Travis", "../../util/GitHub", "@dojo/shim/array", "../../util/environment", "../../log"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Travis_1 = require("../../util/Travis");
    var GitHub_1 = require("../../util/GitHub");
    var array_1 = require("@dojo/shim/array");
    var env = require("../../util/environment");
    var log_1 = require("../../log");
    function shouldCreateGithubAuth(envvars, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var authEnvVar, response, limits, hasAuth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authEnvVar = array_1.find(envvars, function (envvar) {
                            return envvar.name === env.githubAuthName;
                        });
                        if (!authEnvVar) {
                            return [2, true];
                        }
                        repo = new GitHub_1.default(repo.owner, repo.name);
                        repo.api.authenticate(env.githubAuth(authEnvVar.value));
                        return [4, repo.api.misc.getRateLimit({})];
                    case 1:
                        response = _a.sent();
                        limits = response.data;
                        hasAuth = limits && limits.resources;
                        if (hasAuth) {
                            log_1.logger.info('An existing environment variable exists with a GitHub authorization');
                            log_1.logger.info("Currently " + limits.resources.core.limit + " queries remain");
                        }
                        return [2, !hasAuth];
                }
            });
        });
    }
    function initAuthorization(repo, travis) {
        if (travis === void 0) { travis = new Travis_1.default(); }
        return __awaiter(this, void 0, void 0, function () {
            var appAuth, travisRepo, travisEnvVars, tokenStr, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!travis.isAuthorized()) return [3, 2];
                        log_1.logger.info('Creating a temporary authorization token in GitHub for Travis');
                        return [4, travis.createAuthorization(repo)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, 12, 14]);
                        return [4, travis.fetchRepository(repo.toString())];
                    case 3:
                        travisRepo = _a.sent();
                        return [4, travisRepo.listEnvironmentVariables()];
                    case 4:
                        travisEnvVars = _a.sent();
                        return [4, shouldCreateGithubAuth(travisEnvVars, repo)];
                    case 5:
                        if (!_a.sent()) return [3, 8];
                        log_1.logger.info('Creating an OAuth token for GitHub queries');
                        return [4, repo.createAuthorization({
                                note: 'Authorization for Travis to call GitHub APIs',
                                fingerprint: repo.toString()
                            })];
                    case 6:
                        appAuth = _a.sent();
                        tokenStr = "'" + JSON.stringify({
                            type: 'oauth',
                            token: appAuth.token
                        }) + "'";
                        return [4, travisRepo.setEnvironmentVariables({ name: env.githubAuthName, value: tokenStr, isPublic: false })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3, 14];
                    case 9:
                        e_1 = _a.sent();
                        if (!appAuth) return [3, 11];
                        return [4, repo.deleteAuthorization(appAuth.id)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: throw e_1;
                    case 12:
                        log_1.logger.info('Removing temporary authorization token from GitHub');
                        return [4, travis.deleteAuthorization(repo)];
                    case 13:
                        _a.sent();
                        return [7];
                    case 14: return [2];
                }
            });
        });
    }
    exports.default = initAuthorization;
});
//# sourceMappingURL=initAuthorization.js.map