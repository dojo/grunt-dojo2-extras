import * as mockery from 'mockery';
import * as tslib from 'tslib';

export default function loadModule<T>(require: NodeRequire, mid: string, mocks: any, returnDefault: boolean = true): T {
	const moduleUnderTestPath = require.resolve(mid);

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

	const module = require(moduleUnderTestPath);
	return returnDefault && module.default ? module.default : module;
}

export function cleanupModuleMocks() {
	mockery.deregisterAll();
	mockery.disable();
}
