import * as mockery from 'mockery';
import { AmdRootRequire } from '@dojo/core/load';

declare const require: AmdRootRequire;

const tslib: any = require('tslib');

export default function loadModule<T>(mid: string, mocks: any, returnDefault: boolean = true): T {
	mockery.enable({
		useCleanCache: true,
		warnOnReplace: false,
		warnOnUnregistered: false
	});
	mockery.resetCache();

	for (const mid in mocks) {
		mockery.registerMock(mid, mocks[mid]);
	}

	mockery.registerMock('tslib', tslib);

	const loader = require.nodeRequire || require;
	const module = loader(require.toUrl(mid));
	return returnDefault && module.default ? module.default : module;
}

export function cleanupModuleMocks() {
	mockery.deregisterAll();
	mockery.disable();
}
