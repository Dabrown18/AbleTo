import { NativeModules } from 'react-native';

type Keys = {
    privateKey: string;
    publicKey: string;
};

type DecryptedFields = {
    title: string;
    body: string;
};

type Encryption = {
    generateKeyPair(keySize: number): Promise<Keys>;
    decrypt(title: string, body: string, privateKey: string): Promise<DecryptedFields>;
};

const Encryption: Encryption = NativeModules.Encryption;

export default Encryption;
