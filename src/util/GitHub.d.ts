import * as GitHubApi from 'github';
import { AuthorizationCreateParams } from 'github';
import '@dojo/shim/Promise';
export interface Tag {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
}
export interface AuthResponse {
    id: number;
    token: string;
    note: string;
    fingerprint: string;
}
export declare type OAuthScope = 'user' | 'user:email' | 'user:follow' | 'public_repo' | 'repo' | 'repo_deployment' | 'repo:status' | 'delete_repo' | 'notifications' | 'gist' | 'read:repo_hook' | 'write:repo_hook' | 'admin:repo_hook' | 'admin:org_hook' | 'read:org' | 'write:org' | 'admin:org' | 'read:public_key' | 'write:public_key' | 'admin:public_key' | 'read:gpg_key' | 'write:gpg_key' | 'admin:gpg_key';
export default class GitHub {
    name: string;
    owner: string;
    readonly _api: GitHubApi;
    private authed;
    constructor(owner: string, name: string);
    readonly api: GitHubApi;
    readonly url: string;
    createAuthorization(params: AuthorizationCreateParams): Promise<AuthResponse>;
    createKey(key: string): Promise<any>;
    deleteAuthorization(id: string | number): Promise<any>;
    deleteKey(id: string | number): Promise<any>;
    fetchTags(): Promise<Tag[]>;
    findAuthorization(params: AuthorizationCreateParams): Promise<AuthResponse>;
    isApiAuthenticated(): boolean;
    getHttpsUrl(): string;
    getSshUrl(): string;
    toString(): string;
}
