/// <reference types="grunt" />
import IMultiTask = grunt.task.IMultiTask;
import ITask = grunt.task.ITask;
export default function wrapAsyncTask<T>(task: (this: IMultiTask<T>) => Promise<any>): (this: ITask) => void;
