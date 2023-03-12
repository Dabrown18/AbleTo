import EncryptedStorage from 'react-native-encrypted-storage';

export const getItem = async (key: string) => {
    try {
        return await EncryptedStorage.getItem(key);
    } catch (error) {
        return null;
    }
};

export const setItem = async (key: string, value: string | object) => {
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;

    try {
        await EncryptedStorage.setItem(key, valueToStore);
    } catch (error) {}
};

export const removeItem = async (key: string) => {
    try {
        await EncryptedStorage.removeItem(key);
    } catch (error) {}
};

export const clear = async () => await EncryptedStorage.clear();
