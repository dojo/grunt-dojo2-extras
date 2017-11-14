const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { makeTempDirectory } from 'src/util/file';
import { existsSync, statSync } from 'fs';

registerSuite('file', {

	tempDirectory() {
		const path = makeTempDirectory('.test');
		assert.isTrue(existsSync(path));
		assert.isTrue(statSync(path).isDirectory());
	}
});
