import messaging from '@react-native-firebase/messaging';

import { decryptMessage, generateKeyPair } from './encryption';
import { displayNotification } from './notifications';
import request from './request';

export type Data = {
    encrypted: string;
    title: string;
    badge: string;
    type: string;
    sound: string;
    body: string;
    t: string;
    a: string;
};

type Message = {
    sentTime: number;
    data: Data;
    messageId: string;
    ttl: number;
    from: string;
};

export const registerFirebaseToken = async () => {
    const algorithm = 'RSA-OAEP-SHA1';
    const publicKey = await generateKeyPair();

    const token = await messaging().getToken();

    const beginHeader = '-----BEGIN PUBLIC KEY-----';
    const endHeader = '-----END PUBLIC KEY-----';
    const publicKeyWithHeaders = `${beginHeader}\n${publicKey}\n${endHeader}`;

    await request.post('/firebase_tokens', { firebase_token: { token, public_key: publicKeyWithHeaders, algorithm } });
};

export const refreshFCMToken = () => {
    messaging().onTokenRefresh(async () => await registerFirebaseToken());
};

export const onMessageReceived = async (message: Message) => {
    const data = message.data;

    // The encrypted property is a string so that's why we have this weird check
    if (data?.encrypted && data?.encrypted === 'true') {
        const decryptedFields = await decryptMessage(data);

        if (!decryptedFields) return;

        data.title = decryptedFields.title;
        data.body = decryptedFields.body;
    } else {
        /** Braze push notification payload
         * @property data.t {string} Braze sends the t property, which represents the title
         * @property data.a {string} Braze sends the a property, which represents the title
         */
        data.title = data.t;
        data.body = data.a;
    }

    await displayNotification(data);
};
