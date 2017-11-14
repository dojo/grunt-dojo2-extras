const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import loadModule, { cleanupModuleMocks } from '../../../_support/loadModule';
import { stub, SinonStub } from 'sinon';

let installDependencies: any;
let joinStub: SinonStub;
let promiseExecStub: SinonStub;
let existsSyncStub: SinonStub;

registerSuite('commands/installDependencies', {
	before() {
		joinStub = stub();
		promiseExecStub = stub();
		existsSyncStub = stub();
	},

	after() {
		cleanupModuleMocks();
	},

	beforeEach() {
		installDependencies = loadModule('src/commands/installDependencies', {
			'path': {
				join: joinStub
			},
			'../util/process': {
				promiseExec: promiseExecStub
			},
			'fs': {
				existsSync: existsSyncStub
			}
		});
	},

	afterEach() {
		joinStub.reset();
		promiseExecStub.reset();
		existsSyncStub.reset();
	},

	tests: {
	installDependencies: (() => {
		const dir = 'dir';
		const typingsJsonDir = 'dir/typings.json';

		return {
			async 'typings.json exists'() {
				existsSyncStub.returns(true);

				await assertInstallDependencies(dir);

				assert.isTrue(promiseExecStub.calledTwice);
				assert.strictEqual(promiseExecStub.secondCall.args[1].cwd, dir);
			},

			async 'typings.json does not exist'() {
				existsSyncStub.returns(false);

				await assertInstallDependencies(dir);

				assert.isTrue(promiseExecStub.calledOnce);
			}
		};

		async function assertInstallDependencies(dir: string) {
			joinStub.returns(typingsJsonDir);

			const typingsJson = await installDependencies(dir);

			assert.strictEqual(typingsJson, typingsJsonDir);
			assert.isTrue(joinStub.calledOnce);
			assert.strictEqual(joinStub.firstCall.args[0], dir);
			assert.strictEqual(promiseExecStub.firstCall.args[1].cwd, dir);

			return typingsJson;
		}
	})()
	}
});
