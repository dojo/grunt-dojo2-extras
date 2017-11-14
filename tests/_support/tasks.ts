import { SinonStub } from 'sinon';
import Deferred from 'intern/lib/Deferred';

export function setupWrappedAsyncStub(this: any, stub: SinonStub, dfd: Deferred<any>, callback: () => any) {
	stub.callsFake((task: () => Promise<any>) => {
		task.call(this).then(dfd.callback(callback));
	});
}
