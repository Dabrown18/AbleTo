import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import queryClient from '@src/config/queryClient';
import { AuthStackParamList } from '@src/navigation/AuthStack';
import { authActions } from '@src/redux/slices/authSlice';
import { ErrorMessages } from '@src/screens/auth/EnterEmail';
import analytics from '@src/services/analytics/analytics';
import event from '@src/services/analytics/event';
import { authenticate } from '@src/services/auth';
import { getFeatureFlags } from '@src/services/featureFlags';
import Logger from '@src/services/logger';
import { registerFirebaseToken } from '@src/services/messaging';
import { attachJwtToken, detachJwtToken } from '@src/services/request';
import { clearTokens, storeJWT, storeTokens } from '@src/services/tokens';
import { getSelf } from '@src/services/user';
import { fetchUserProgram } from '@src/services/userProgram';

type EnterEmailScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EnterEmail'>;

const useAuth = () => {
    const dispatch = useDispatch();
    const {
        setJwtToken,
        setIdpToken,
        setIsLoadingUser,
        setIsLoadingToken,
        setUser,
        setIsAuthenticated,
        setFeatureFlags,
    } = authActions;
    const navigation = useNavigation<EnterEmailScreenNavigationProp>();

    // Save the JWT token in memory and attach it
    // to outgoing requests as a http header
    const saveJwtToken = useCallback(
        (token: string) => {
            dispatch(setJwtToken(token));
            attachJwtToken(token);
        },
        [dispatch, setJwtToken]
    );

    const fetchUser = useCallback(async () => {
        try {
            dispatch(setIsLoadingUser(true));

            // This is not information that the app currently uses
            // It is included here, as this is the only endpoint that currently controls
            // program-specific forced upgrades. We do not care about any errors thrown here,
            // and as such silence them.
            fetchUserProgram().catch((e) => e);

            const self = await getSelf();
            const featureFlags = await getFeatureFlags();
            dispatch(setUser(self.user));
            dispatch(setFeatureFlags(featureFlags));

            await analytics.reset(self);

            Logger.attachUserInfo(self.user.id.toString(), self.user.email ?? '');
        } finally {
            dispatch(setIsLoadingUser(false));
        }
    }, [dispatch, setFeatureFlags, setIsLoadingUser, setUser]);

    /**
     * Authenticates the user.
     * If successful persists a JWT and IDP token on the phone.
     * Adds an "Authorization" header to outgoing requests.
     * Fetches the current user's information.
     * Finally registers a new firebase token for Push Notifications.
     */
    const login = useCallback(
        async (email: string, password: string, otpAttempt?: string) => {
            dispatch(setIsLoadingToken(true));
            try {
                const { jwtToken: jwt, idpToken: idp } = await authenticate({ email, password, otpAttempt });
                await storeJWT(jwt);
                saveJwtToken(jwt);
                dispatch(setIdpToken(idp));
                await fetchUser();
                await registerFirebaseToken();

                analytics.track(event.loginSuccess);

                dispatch(setIsAuthenticated(true));
            } catch (error) {
                if (error.message === 'general.errors.general') Logger.error(error, 'Failed to load user information');
                throw new Error(error.message);
            } finally {
                dispatch(setIsLoadingToken(false));
            }
        },
        [dispatch, fetchUser, saveJwtToken, setIdpToken, setIsAuthenticated, setIsLoadingToken]
    );

    const onWebViewLogin = useCallback(
        async (jwt: string, idp: string) => {
            dispatch(setIsLoadingToken(true));
            try {
                await storeJWT(jwt);
                saveJwtToken(jwt);
                dispatch(setIdpToken(idp));
                await fetchUser();
                await registerFirebaseToken();

                storeTokens({ jwtToken: jwt, idpToken: idp });
                dispatch(setIsAuthenticated(true));
            } catch (error) {
                Logger.error(error, 'Failed to load user information');
            } finally {
                dispatch(setIsLoadingToken(false));
            }
        },
        [dispatch, fetchUser, saveJwtToken, setIdpToken, setIsAuthenticated, setIsLoadingToken]
    );

    /**
     * Removes the "Authorization" header from outgoing requests.
     * Clears both JWT & IDP tokens from memory and phone storage.
     * Clears out the user object and invalidates all cache.
     */
    const logout = useCallback(async () => {
        detachJwtToken();
        dispatch(setIsAuthenticated(false));
        dispatch(setJwtToken(''));
        dispatch(setIdpToken(''));
        dispatch(setUser(undefined));

        queryClient.clear();

        clearTokens();
        analytics.identifyGuestUser(await getSelf());
    }, [dispatch, setIdpToken, setIsAuthenticated, setJwtToken, setUser]);

    const onSessionExpiration = useCallback(() => {
        logout();
        navigation.navigate('EnterEmail', { message: ErrorMessages.SESSION_TIMED_OUT });
    }, [logout, navigation]);

    return { saveJwtToken, fetchUser, login, onWebViewLogin, logout, onSessionExpiration };
};

export default useAuth;
