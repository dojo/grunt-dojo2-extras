import loadModule, { cleanupModuleMocks } from '../../../_support/loadModule';
import { stub, SinonStub } from 'sinon';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

let module: any;
let existsSyncStub: SinonStub;
let mkdtempSyncStub: SinonStub;
let mkdirpSyncStub: SinonStub;
let joinStub: SinonStub;

registerSuite('util/file', {
	before() {
		existsSyncStub = stub();
		mkdtempSyncStub = stub();
		mkdirpSyncStub = stub();
		joinStub = stub();
	},

	after() {
		cleanupModuleMocks();
	},

	beforeEach() {
		module = loadModule(require, '../../../../src/util/file', {
			'fs': {
				existsSync: existsSyncStub,
				mkdtempSync: mkdtempSyncStub
			},
			'mkdirp': {
				sync: mkdirpSyncStub
			},
			'path': {
				join: joinStub
			}
		});
	},

	afterEach() {
		existsSyncStub.reset();
		mkdtempSyncStub.reset();
		mkdirpSyncStub.reset();
		joinStub.reset();
	},

	tests: {
	makeTempDirectory: {
		'base directory does not exist; directory is created'() {
			existsSyncStub.returns(false);

			module.makeTempDirectory('dir');

			assert.isTrue(existsSyncStub.calledOnce);
			assert.isTrue(mkdirpSyncStub.calledOnce);
		},

		'prefix not provided; defaults to "tmp-"'() {
			existsSyncStub.returns(true);

			module.makeTempDirectory('dir');

			assert.isTrue(joinStub.calledWith('dir', 'tmp-'));
		},

		'value of mkdtempSync is returned'() {
			existsSyncStub.returns(true);
			mkdtempSyncStub.returns('temp_dir');

			const tempDir = module.makeTempDirectory('dir', 'temp_');

			assert.isTrue(joinStub.calledWith('dir', 'temp_'));
			assert.isTrue(mkdtempSyncStub.calledOnce);
			assert.strictEqual(tempDir, 'temp_dir');
		}
	}
	}
});
