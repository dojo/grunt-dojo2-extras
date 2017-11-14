import { logger } from '../../src/log';
import IMultiTask = grunt.task.IMultiTask;
import ITask = grunt.task.ITask;

export default function wrapAsyncTask<T>(task: (this: IMultiTask<T>) => Promise<any>) {
	return function (this: ITask) {
		const done = this.async();
		task.call(this).then(done, function (e: Error) {
			if (e) {
				logger.error(e.message);
			}
			done(false);
		});
	};
}
