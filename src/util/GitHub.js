(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./environment", "github", "@dojo/shim/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
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
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var response;
                return tslib_1.__generator(this, function (_a) {
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
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var reponse;
                return tslib_1.__generator(this, function (_a) {
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
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2, this.api.authorization.delete({
                            id: String(id)
                        })];
                });
            });
        };
        GitHub.prototype.deleteKey = function (id) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2, this.api.repos.deleteKey({
                            id: String(id),
                            owner: this.owner,
                            repo: this.name
                        })];
                });
            });
        };
        GitHub.prototype.fetchTags = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var response;
                return tslib_1.__generator(this, function (_a) {
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
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var response, auths;
                return tslib_1.__generator(this, function (_a) {
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