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
        define(["require", "exports", "./environment", "github", "@dojo/shim/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var environment_1 = require("./environment");
    var GitHubApi = require("github");
    require("@dojo/shim/Promise");
    var GitHub = (function () {
        function GitHub(owner, name) {
            this.authed = false;
            if (!owner) {
                throw new Error('A repo owner must be specified');
            }
            if (!name) {
                throw new Error('A repo name must be specified');
            }
            this._api = new GitHubApi({
                headers: {
                    'user-agent': 'grunt-dojo2-extras'
                },
                Promise: Promise
            });
            this.owner = owner;
            this.name = name;
        }
        Object.defineProperty(GitHub.prototype, "api", {
            get: function () {
                this.isApiAuthenticated();
                return this._api;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GitHub.prototype, "url", {
            get: function () {
                return environment_1.hasGitCredentials() ? this.getSshUrl() : this.getHttpsUrl();
            },
            enumerable: true,
            configurable: true
        });
        GitHub.prototype.createAuthorization = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.api.authorization.create(params)];
                        case 1:
                            response = _a.sent();
                            return [2, response.data];
                    }
                });
            });
        };
        GitHub.prototype.createKey = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var reponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.api.repos.createKey({
                                key: key,
                                owner: this.owner,
                                read_only: false,
                                repo: this.name,
                                title: 'Auto-created Travis Deploy Key'
                            })];
                        case 1:
                            reponse = _a.sent();
                            return [2, reponse.data];
                    }
                });
            });
        };
        GitHub.prototype.deleteAuthorization = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.api.authorization.delete({
                            id: String(id)
                        })];
                });
            });
        };
        GitHub.prototype.deleteKey = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.api.repos.deleteKey({
                            id: String(id),
                            owner: this.owner,
                            repo: this.name
                        })];
                });
            });
        };
        GitHub.prototype.fetchTags = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.api.repos.getTags({
                                owner: this.owner,
                                repo: this.name
                            })];
                        case 1:
                            response = _a.sent();
                            return [2, response.data];
                    }
                });
            });
        };
        GitHub.prototype.findAuthorization = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var response, auths;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.api.authorization.getAll({
                                page: 1
                            })];
                        case 1:
                            response = _a.sent();
                            auths = response.data || [];
                            return [2, auths.filter(function (auth) {
                                    for (var name_1 in params) {
                                        var expected = params[name_1];
                                        var actual = auth[name_1];
                                        if (Array.isArray(expected)) {
                                            if (!Array.isArray(actual)) {
                                                return false;
                                            }
                                            for (var _i = 0, expected_1 = expected; _i < expected_1.length; _i++) {
                                                var value = expected_1[_i];
                                                if (actual.indexOf(value) === -1) {
                                                    return false;
                                                }
                                            }
                                        }
                                        else if (expected !== actual) {
                                            return false;
                                        }
                                    }
                                    return true;
                                })[0]];
                    }
                });
            });
        };
        GitHub.prototype.isApiAuthenticated = function () {
            if (!this.authed) {
                var auth = environment_1.githubAuth();
                if (auth) {
                    this._api.authenticate(auth);
                }
                this.authed = true;
            }
            return !!this._api.auth;
        };
        GitHub.prototype.getHttpsUrl = function () {
            return "https://github.com/" + this.owner + "/" + this.name + ".git";
        };
        GitHub.prototype.getSshUrl = function () {
            return "git@github.com:" + this.owner + "/" + this.name + ".git";
        };
        GitHub.prototype.toString = function () {
            return this.owner + "/" + this.name;
        };
        return GitHub;
    }());
    exports.default = GitHub;
});
//# sourceMappingURL=GitHub.js.map