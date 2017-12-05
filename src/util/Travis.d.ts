import GitHub from './GitHub';
export interface AuthenticateResponse {
    access_token: string;
}
export interface FetchRepositoryResponse {
    repo: RepositoryData;
}
export default class Travis {
    token?: string;
    private githubAuthorization;
    authenticate(githubToken: string): Promise<string>;
    createAuthorization(repo: GitHub): Promise<void>;
    deleteAuthorization(repo: GitHub): Promise<void>;
    fetchRepository(slug: string): Promise<Repository>;
    isAuthorized(): boolean;
}
export interface RepositoryData {
    active: boolean;
    id: number;
    slug: string;
}
export interface EnvironmentVariable {
    id: string;
    name: string;
    value: string;
    'public': boolean;
    repository_id: number;
}
export interface ListEnvironmentVariablesResponse {
    env_vars: EnvironmentVariable[];
}
export declare class Repository {
    active: boolean;
    id: number;
    slug: string;
    token: string;
    constructor(token: string, repo: RepositoryData);
    listEnvironmentVariables(): Promise<EnvironmentVariable[]>;
    setEnvironmentVariables(...variables: Array<{
        name: string;
        value: string;
        isPublic?: boolean;
    }>): Promise<void>;
    private addEnvironmentVariable(name, value, isPublic?);
    private updateEnvironmentVariable(id, name, value, isPublic?);
}
