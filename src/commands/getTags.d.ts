import GitHub, { Tag } from '../util/GitHub';
export interface TagFilter {
    (tag: Tag, index: number, array: Tag[]): boolean;
}
export declare function getHtmlApiPath(base: string, project: string, version: string): string;
export declare function getJsonApiPath(base: string, project: string, version: string): string;
export declare function createHtmlApiMissingFilter(project: string, directory: string): TagFilter;
export declare function createJsonApiMissingFilter(project: string, directory: string): TagFilter;
export declare function latestFilter(_tag: Tag, index: number, array: Tag[]): boolean;
export declare function createVersionFilter(comp: string): TagFilter;
export default function getTags(repo: GitHub, filters?: TagFilter[]): Promise<Tag[]>;
