import { version } from '@src/../package.json';
import Axios, { AxiosInstance } from 'axios';
import { API_URL } from 'react-native-dotenv';
import { v4 as uuidv4 } from 'uuid';

import { Doorman } from './doorman';
import { getIdpInstanceId } from './idp';

const request: AxiosInstance = Axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
        'Accept-Charset': 'UTF-8',
        'Auth-Device-Type': 'android',
        'Android-App-Version': version,
        'Auth-Host-Device-Type': 'android',
        'Content-Type': 'application/json; charset=utf-8',
    },
});

const attachHeaders = async () => {
    const authDeviceID = await getIdpInstanceId();

    request.defaults.headers.common['Auth-Device-ID'] = authDeviceID;
};

const attachInterceptors = () => {
    request.interceptors.request.use((config) => {
        if (config.headers) config.headers['Request-ID'] = uuidv4();
        return config;
    });

    request.interceptors.response.use(
        async (res) => {
            if (res.data.error) {
                // We have some sneaky errors, hiding in 200 OKs, that we want to catch
                // Those errors are all the same - they have an error object in their returned data
                // If we find a sneaky error, we expose it here, by throwing a loud exception instead
                throw new Error(res.data.error?.reason);
            }

            return res;
        },
        (err) => {
            if (err && err.response && err.response.status === 401) {
                // Logout unauthenticated users
                Doorman.lock();
            }

            if (err && err.response && err.response.status === 410) {
                // Force upgrade if status code is 410
                // Resolve with an empty object to silence any
                // errors due to the failed request
                Doorman.emitUpgrade();
                return Promise.resolve({ data: {} });
            }

            return Promise.reject(err);
        }
    );
};

attachHeaders();
attachInterceptors();

export const switchAxiosBaseURL = (baseURL: string) => (request.defaults.baseURL = baseURL);

export const attachJwtToken = (token: string) => (request.defaults.headers.common.Authorization = `Bearer ${token}`);

export const detachJwtToken = () => delete request.defaults.headers.common.Authorization;

export default request;
