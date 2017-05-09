import { EncryptResult, KeyPairFiles } from '../../util/crypto';
export default function createDeployKey(deployKeyFile?: string, encryptedKeyFile?: string): Promise<KeyPairFiles & {
    encryptedKey: EncryptResult;
}>;
