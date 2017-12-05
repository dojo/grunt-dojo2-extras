import typedoc from '../../src/commands/typedoc';
import { tmpDirectory } from '../_support/tmpFiles';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

registerSuite('typedoc', {

	async build() {
		const out = tmpDirectory();

		await typedoc(resolve('./assets/sample'), out);
		const indexFile = readFileSync(join(out, 'index.html'));
		assert.include(String(indexFile), 'This is a README!');
	}
});
