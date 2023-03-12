import * as Sentry from '@sentry/react-native';

import { isDevBuild } from './helpers';

const Logger = {
    message: (message: string) => {
        if (!isDevBuild) return Sentry.captureMessage(message);

        return console.warn(message);
    },
    error: (error: Error, message?: string) => {
        if (!isDevBuild) return Sentry.captureException(error, { fingerprint: message ? [message] : undefined });

        return console.error(message, error);
    },
    attachUserInfo: (id: string, email: string) => {
        Sentry.setUser({ id, email });
    },
};

export default Logger;
