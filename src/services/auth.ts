import analytics from './analytics/analytics';
import event from './analytics/event';
import { emailHasIdpPassword, idpLogin, idpPasswordReset, idpRegister } from './idp';
import Logger from './logger';
import request from './request';
import { storeTokens } from './tokens';
import queryClient from '@src/config/queryClient';

type AuthPayload = {
    email: string;
    password?: string;
    idpToken?: string;
    otpAttempt?: string;
};

type AuthResponse = {
    token: string;
    jwt: {
        token: string;
    };
};

const login = async ({ email, password, idpToken, otpAttempt }: AuthPayload): Promise<AuthResponse> => {
    const { data } = await request.post('/jwt', { email, password, idp_token: idpToken, otp_attempt: otpAttempt });
    return data;
};

const resetPassword = async (email: string) => {
    await request.post('/users/reset_password', { email });
};

export const attemptToLogin = async (email: string) => {
    try {
        await login({ email });

        // In practice, we won't reach this return statement, as passing only an email
        // to the /jwt endpoint will always result in an error. We need to check said errors
        // and see if it is due to the user's email being invalid or not.
        return null;
    } catch (error) {
        return error.message;
    }
};

export const authenticate = async ({ email, password, otpAttempt }: Omit<AuthPayload, 'idpToken'>) => {
    try {
        const hasFirebasePassword = await emailHasIdpPassword(email).catch(() => false);

        const firebaseCredentials = hasFirebasePassword && password ? await idpLogin(email, password) : null;

        const idpToken = (await firebaseCredentials?.getIdToken()) ?? '';

        // This is an old user that already exists in the Consumer Stack
        // but doesn't have their profile synced to Firebase
        // so we create a new record there
        if (!hasFirebasePassword && password) {
            await idpRegister(email, password);
        }

        const { token: jwtToken } = await login({ email, password, otpAttempt, idpToken });
        storeTokens({ jwtToken, idpToken });
        queryClient.invalidateQueries();

        return { jwtToken, idpToken };
    } catch (error) {
        if (error.response?.status === 401 || error.message.includes('auth/wrong-password')) {
            throw new Error(otpAttempt ? 'log_in.invalid_otp' : 'log_in.invalid_email_and_or_password');
        }

        if (error.message === 'idp_required') {
            const user = await idpLogin(email, password ?? '');
            const idpToken = (await user.getIdToken()) ?? '';
            const { token: jwtToken } = await login({ email, password, idpToken });
            storeTokens({ jwtToken, idpToken });
            queryClient.invalidateQueries();

            return { jwtToken, idpToken };
        }

        switch (error.message) {
            case 'user_not_found':
                throw new Error('log_in.invalid_email_and_or_password');
            case 'password_missing_onboarding_incomplete':
                throw new Error('User does not have a password');
            case 'otp_required':
                throw new Error('log_in.require_otp');
            default:
                analytics.track(event.loginFailure);
                throw new Error('general.errors.general');
        }
    }
};

export const sendPasswordReset = async (email: string) => {
    try {
        const hasIDPPassword = await emailHasIdpPassword(email);

        if (hasIDPPassword) {
            await idpPasswordReset(email);
        } else {
            await resetPassword(email);
        }
    } catch (error) {
        Logger.error(error, 'Failed to send password reset');
    }
};
