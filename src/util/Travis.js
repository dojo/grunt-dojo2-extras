(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@dojo/core/request", "../log"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var request_1 = require("@dojo/core/request");
    var log_1 = require("../log");
    function responseHandler(response) {
        var statusCode = response.status;
        if (statusCode < 200 || statusCode >= 300) {
            var message = response.statusText;
            throw new Error("Travis responded with " + statusCode + ". " + message);
        }
        return response;
    }
    function getHeaders(token) {
        var headers = {
            Accept: 'application/vnd.travis-ci.2+json',
            'Content-type': 'application/json',
            'User-Agent': 'MyClient/1.0.0'
        };
        if (token) {
            headers.Authorization = "token " + token;
        }
        return headers;
    }
    var Travis = (function () {
        function Travis() {
        }
        Travis.prototype.authenticate = function (githubToken) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var response, token;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, request_1.default.post('https://api.travis-ci.org/auth/github', {
                                body: JSON.stringify({
                                    'github_token': githubToken
                                }),
                                headers: getHeaders()
                            }).then(responseHandler)];
                        case 1:
                            response = _a.sent();
                            return [4, response.json()];
                        case 2:
                            token = (_a.sent()).access_token;
                            this.token = token;
                            return [2, token];
                    }
                });
            });
        };
        Travis.prototype.createAuthorization = function (repo) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var params, existing, _a, e_1;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            params = {
                                note: 'temporary token for travis cli',
                                scopes: [
                                    'read:org', 'user:email', 'repo_deployment', 'repo:status', 'public_repo', 'write:repo_hook'
                                ]
                            };
                            return [4, repo.findAuthorization(params)];
                        case 1:
                            existing = _b.sent();
                            if (existing) {
                                throw new Error("An existing authorization exists. \"#" + existing.id + "\"");
                            }
                            _a = this;
                            return [4, repo.createAuthorization(params)];
                        case 2:
                            _a.githubAuthorization = _b.sent();
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 7]);
                            return [4, this.authenticate(this.githubAuthorization.token)];
                        case 4:
                            _b.sent();
                            return [3, 7];
                        case 5:
                            e_1 = _b.sent();
                            log_1.logger.info('Cleaning up temporary GitHub token');
                            return [4, this.deleteAuthorization(repo)];
                        case 6:
                            _b.sent();
                            throw e_1;
                        case 7: return [2];
                    }
                });
            });
        };
        Travis.prototype.deleteAuthorization = function (repo) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.githubAuthorization) return [3, 2];
                            return [4, repo.deleteAuthorization(this.githubAuthorization.id)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2];
                    }
                });
            });
        };
        Travis.prototype.fetchRepository = function (slug) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var endpoint, response, body;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.token) {
                                throw new Error('authenticate() must be called first');
                            }
                            endpoint = "https://api.travis-ci.org/repos/" + slug;
                            return [4, request_1.default.get(endpoint, {
                                    headers: getHeaders(this.token)
                                }).then(responseHandler)];
                        case 1:
                            response = _a.sent();
                            return [4, response.json()];
                        case 2:
                            body = _a.sent();
                            return [2, new Repository(this.token, body.repo)];
                    }
                });
            });
        };
        Travis.prototype.isAuthorized = function () {
            return !!this.githubAuthorization;
        };
        return Travis;
    }());
    exports.default = Travis;
    var Repository = (function () {
        function Repository(token, repo) {
            this.active = !!repo.active;
            this.id = repo.id;
            this.slug = repo.slug;
            this.token = token;
        }
        Repository.prototype.listEnvironmentVariables = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var endpoint, response;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            endpoint = "https://api.travis-ci.org/settings/env_vars?repository_id=" + this.id;
                            return [4, request_1.default.get(endpoint, {
                                    headers: getHeaders(this.token)
                                }).then(responseHandler)];
                        case 1:
                            response = _a.sent();
                            return [4, response.json()];
                        case 2: return [2, (_a.sent()).env_vars];
                    }
                });
            });
        };
        Repository.prototype.setEnvironmentVariables = function () {
            var variables = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                variables[_i] = arguments[_i];
            }
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var envvars, _loop_1, this_1, _a, variables_1, _b, name_1, value, isPublic;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, this.listEnvironmentVariables()];
                        case 1:
                            envvars = _c.sent();
                            _loop_1 = function (name_1, value, isPublic) {
                                var match;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            match = envvars.find(function (envvar) {
                                                return envvar.name === name_1;
                                            });
                                            if (!match) return [3, 2];
                                            return [4, this_1.updateEnvironmentVariable(match.id, name_1, value, isPublic)];
                                        case 1:
                                            _a.sent();
                                            return [3, 4];
                                        case 2: return [4, this_1.addEnvironmentVariable(name_1, value, isPublic)];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2];
                                    }
                                });
                            };
                            this_1 = this;
                            _a = 0, variables_1 = variables;
                            _c.label = 2;
                        case 2:
                            if (!(_a < variables_1.length)) return [3, 5];
                            _b = variables_1[_a], name_1 = _b.name, value = _b.value, isPublic = _b.isPublic;
                            return [5, _loop_1(name_1, value, isPublic)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _a++;
                            return [3, 2];
                        case 5: return [2];
                    }
                });
            });
        };
        Repository.prototype.addEnvironmentVariable = function (name, value, isPublic) {
            if (isPublic === void 0) { isPublic = false; }
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var endpoint, response;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            endpoint = "https://api.travis-ci.org/settings/env_vars?repository_id=" + this.id;
                            return [4, request_1.default.post(endpoint, {
                                    body: JSON.stringify({
                                        'env_var': {
                                            name: name,
                                            value: value,
                                            'public': isPublic
                                        }
                                    }),
                                    headers: getHeaders(this.token)
                                }).then(responseHandler)];
                        case 1:
                            response = _a.sent();
                            return [2, response.json()];
                    }
                });
            });
        };
        Repository.prototype.updateEnvironmentVariable = function (id, name, value, isPublic) {
            if (isPublic === void 0) { isPublic = false; }
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var endpoint, response;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            endpoint = "https://api.travis-ci.org/settings/env_vars/" + id + "?repository_id=" + this.id;
                            return [4, request_1.default(endpoint, {
                                    body: JSON.stringify({
                                        'env_var': {
                                            name: name,
                                            value: value,
                                            'public': isPublic
                                        }
                                    }),
                                    headers: getHeaders(this.token),
                                    method: 'patch'
                                }).then(responseHandler)];
                        case 1:
                            response = _a.sent();
                            return [2, response.json()];
                    }
                });
            });
        };
        return Repository;
    }());
    exports.Repository = Repository;
});
//# sourceMappingURL=Travis.js.map