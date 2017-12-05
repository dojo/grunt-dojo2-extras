/// <reference types="node" />
export default function loadModule<T>(require: NodeRequire, mid: string, mocks: any, returnDefault?: boolean): T;
export declare function cleanupModuleMocks(): void;
