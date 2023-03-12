import Logger from './logger';
import { Data } from './messaging';
import { getItem, setItem } from './storage';
import Encryption from '@src/packages/encryption';

const keySize = 4096;

export const generateKeyPair = async () => {
    const keys = await Encryption.generateKeyPair(keySize);

    await setItem('privateKey', keys.privateKey);

    return keys.publicKey;
};

export const decryptMessage = async (encryptedData: Data) => {
    const privateKey = await getItem('privateKey');

    if (!privateKey) return;

    try {
        const decryptedFields = await Encryption.decrypt(encryptedData.title, encryptedData.body, privateKey);
        return decryptedFields;
    } catch (error) {
        Logger.error(error, 'Failed to decrypt message');
        return null;
    }
};
