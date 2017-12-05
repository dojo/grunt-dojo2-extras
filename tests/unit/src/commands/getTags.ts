import * as path from 'path';
import loadModule, { cleanupModuleMocks } from '../../../_support/loadModule';
import { stub, SinonStub } from 'sinon';
import { getHtmlApiPath, getJsonApiPath } from '../../../../src/commands/getTags';
import { Tag } from '../../../../src/util/GitHub';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

let module: any;
let existsSyncStub: SinonStub;

function assertExistsFilter(builder: any, expected: boolean, filename: string) {
	const filter = builder('project', 'directory');
	existsSyncStub.returns(expected);
	assert.strictEqual(filter({ name: 'version' }), !expected);
	assert.isTrue(existsSyncStub.called, 'existSync was not called');
	assert.strictEqual(existsSyncStub.firstCall.args[0], filename);
}

registerSuite('getTags', {
	before() {
		existsSyncStub = stub();
	},

	after() {
		cleanupModuleMocks();
	},

	beforeEach() {
		module = loadModule(require, '../../../../src/commands/getTags', {
			fs: {
				existsSync: existsSyncStub
			}
		}, false);
	},

	afterEach() {
		existsSyncStub.reset();
	},

	tests: {
	getHtmlApiPath() {
		assert.strictEqual(getHtmlApiPath('base', 'project', 'version'), path.join('base', 'project', 'version'));
	},

	getJsonApiPath() {
		assert.strictEqual(getJsonApiPath('base', 'project', 'version'), path.join('base', 'project-version.json'));
	},

	filters: {
		createHtmlApiMissingFilter: {
			'exists; returns false'() {
				const { createHtmlApiMissingFilter } = module;
				assertExistsFilter(createHtmlApiMissingFilter, true, path.join('directory', 'project', 'version'));
			},

			'does not exist; returns true'() {
				const { createHtmlApiMissingFilter } = module;
				assertExistsFilter(createHtmlApiMissingFilter, false, path.join('directory', 'project', 'version'));
			}
		},

		createJsonApiMissingFilter: {
			'exists; returns false'() {
				const { createJsonApiMissingFilter } = module;
				assertExistsFilter(createJsonApiMissingFilter, true, path.join('directory', 'project-version.json'));
			},

			'does not exist; returns true'() {
				const { createJsonApiMissingFilter } = module;
				assertExistsFilter(createJsonApiMissingFilter, false, path.join('directory', 'project-version.json'));
			}
		},

		latestFilter() {
			const { latestFilter } = module;
			const list = [ 'one', 'two', 'three' ];
			assert.deepEqual(list.filter(latestFilter), [ 'three' ]);
		},

		createVersionFilter: {
			'satisfies semver; returns true'() {
				const { createVersionFilter } = module;
				const filter = createVersionFilter('>= 2.0.0');
				assert.isTrue(filter({ name: '2.0.0' }));
			},

			'does not satisfy semver; returns false'() {
				const { createVersionFilter } = module;
				const filter = createVersionFilter('< 2.0.0');
				assert.isFalse(filter({ name: '2.0.0' }));
			}
		}
	},

	getTags: (() => {
		let getTags: any;
		let mockGitHub: any;

		return {
			before() {
				getTags = module.default;
				mockGitHub = {
					fetchTags() {
						return Promise.resolve([
							{ name: 'one' },
							{ name: '2.0.0' },
							{ name: '1.6.5' },
							{ name: '3.0.0-beta' }
						]);
					}
				};
			},

			tests: {
			async 'removes version not compatible with semver'() {
				const tags = await getTags(mockGitHub);
				const expected = [
					{ name: '1.6.5' },
					{ name: '2.0.0' },
					{ name: '3.0.0-beta' }
				];
				assert.deepEqual(tags, expected);
			},

			async 'applies filters'() {
				const filter = (tag: Tag) => {
					return tag.name === '2.0.0';
				};
				const tags = await getTags(mockGitHub, [ filter ]);
				const expected = [
					{ name: '2.0.0' }
				];
				assert.deepEqual(tags, expected);
			}
			}
		};
	})()
	}
});
