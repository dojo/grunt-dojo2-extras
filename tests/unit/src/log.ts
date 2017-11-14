const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as log from 'src/log';
import { LogStream } from 'src/log';
import { TransportInstance, transports } from 'winston';

const cachedTransports: { [ key: string ]: TransportInstance } = {};

registerSuite('log', {
	before() {
		for (let key in log.logger.transports) {
			cachedTransports[key] = log.logger.transports[key];
		}
		log.logger.clear();
	},

	after() {
		log.logger.clear();
		for (let key in cachedTransports) {
			log.logger.add(cachedTransports[key], {}, true);
		}
	},

	tests: {
	async LogStream() {
		const memory = new transports.Memory();
		log.logger.add(memory, {}, true);

		const expected = 'Hello World';
		const stream = new LogStream();

		stream.write(expected);
		stream.end();

		assert.strictEqual(memory.writeOutput[0] as any, `info: ${ expected }`);
	}
	}
});
