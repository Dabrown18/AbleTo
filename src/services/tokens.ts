import { getIdpUser } from './idp';
import request from './request';
import { getItem, removeItem, setItem } from './storage';

type AuthTokens = {
    jwtToken: string;
    idpToken: string;
};

const JWT_TOKEN_KEY = 'key_jwt_token';
const IDP_TOKEN_KEY = 'key_idp_token';

export const storeJWT = async (token: string) => setItem(JWT_TOKEN_KEY, token);
export const getJWT = async () => getItem(JWT_TOKEN_KEY);

export const storeIDP = async (token: string) => setItem(IDP_TOKEN_KEY, token);
export const getIDP = async () => getItem(IDP_TOKEN_KEY);

export const storeTokens = async ({ jwtToken, idpToken }: AuthTokens) => {
    storeIDP(idpToken);
    storeJWT(jwtToken);
};

export const clearTokens = async () => {
    removeItem(JWT_TOKEN_KEY);
    removeItem(IDP_TOKEN_KEY);
};

export const getCustomFirebaseToken = async () => {
    const currentUser = getIdpUser();

    if (!currentUser) return;

    const { data } = await request.post('/firebase_tokens/custom_token', {
        user: {
            uid: currentUser.uid,
        },
    });

    return data;
};
