import { logger } from '../log';
import { join } from 'path';
import { promiseExec } from '../util/process';
import { existsSync } from 'fs';

export default async function installDependencies(dir: string) {
	logger.info('Installing dependencies');
	const typingsJson = join(dir, 'typings.json');
	await promiseExec('npm install', {silent: false, cwd: dir});

	if (existsSync(typingsJson)) {
		await promiseExec('typings install', {silent: false, cwd: dir});
	}
	return typingsJson;
}
