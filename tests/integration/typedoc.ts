const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import typedoc from 'src/commands/typedoc';
import { tmpDirectory } from '../_support/tmpFiles';
import { readFileSync } from 'fs';
import { join } from 'path';

registerSuite('typedoc', {

	async build() {
		const out = tmpDirectory();

		await typedoc((<any> require).toUrl('assets/sample'), out);
		const indexFile = readFileSync(join(out, 'index.html'));
		assert.include(String(indexFile), 'This is a README!');
	}
});
