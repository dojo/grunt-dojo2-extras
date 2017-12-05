import Git from '../../src/util/Git';
import { tmpDirectory } from '../_support/tmpFiles';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

registerSuite('git', {

	async build() {
		const out = tmpDirectory();
		const repo = new Git(out);

		assert.isFalse(repo.isInitialized());
	}
});
