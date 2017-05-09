import Travis from '../../util/Travis';
import GitHub from '../../util/GitHub';
export interface Options {
    deployKeyFile: string;
    encryptedKeyFile: string;
}
export default function initDeployment(repo: GitHub, travis?: Travis, options?: Options): Promise<void>;
