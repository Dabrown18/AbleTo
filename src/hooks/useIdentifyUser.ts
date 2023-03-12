import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useDidMount from './useDidMount';
import useAuth from '@src/hooks/useAuth';
import { authActions } from '@src/redux/slices/authSlice';
import { selectAuthState } from '@src/redux/slices/authSlice/selectors';
import analytics from '@src/services/analytics/analytics';
import { Doorman } from '@src/services/doorman';
import { registerFirebaseToken } from '@src/services/messaging';
import request from '@src/services/request';
import { getIDP, getJWT } from '@src/services/tokens';

const useIdentifyUser = () => {
    const dispatch = useDispatch();
    const { setIdpToken, setIsLoadingToken, setIsAuthenticated } = authActions;
    const { isAuthenticated } = useSelector(selectAuthState);
    const { saveJwtToken, fetchUser, onSessionExpiration } = useAuth();

    // Loads persisted JWT/IDP tokens on startup
    // Fetches updated user info, which also checks
    // if the user session is still valid
    useDidMount(() => {
        (async () => {
            try {
                dispatch(setIsLoadingToken(true));
                const idp = await getIDP();
                const jwt = await getJWT();

                if (idp) dispatch(setIdpToken(idp));
                if (!jwt) {
                    const self = await request.get('/users/me');
                    analytics.identifyGuestUser(self.data);
                } else {
                    if (isAuthenticated) return;
                    saveJwtToken(jwt);

                    // This needs to fire onMount
                    // to ensure that users that
                    // are upgrading from Android Native
                    // and have their session kept without authenticating
                    // will also register their new firebase token
                    // to receive notifications from rails
                    await registerFirebaseToken();
                    await fetchUser();

                    dispatch(setIsAuthenticated(true));
                }
            } catch {
                dispatch(setIsAuthenticated(false));
            } finally {
                dispatch(setIsLoadingToken(false));
            }
        })();
    });

    useEffect(() => {
        if (!isAuthenticated) return;

        const guard = Doorman.guard(onSessionExpiration);

        return () => guard.remove();
    }, [isAuthenticated, onSessionExpiration, saveJwtToken]);
};

export default useIdentifyUser;
