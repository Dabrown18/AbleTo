import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import useNoInternet from './useNoNetwork';
import queryClient from '@src/config/queryClient';
import { authActions } from '@src/redux/slices/authSlice';
import { selectAuthState } from '@src/redux/slices/authSlice/selectors';
import { RootStackParamList } from '@src/services/activities/types';
import { isSelfCare } from '@src/services/program';
import { getSelf } from '@src/services/user';

const useOnProgramLevelSwitch = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const appState = useRef(AppState.currentState);
    const { user } = useSelector(selectAuthState);
    const { setUser } = authActions;
    const isInternetNotReachable = useNoInternet();
    const [shouldFetchUserOnNetworkReconnect, setShouldFetchUserOnNetworkReconnect] = useState(false);

    const fetchAndSetUser = useCallback(async () => {
        const self = await getSelf();
        dispatch(setUser(self.user));
    }, [dispatch, setUser]);

    useEffect(() => {
        // Fetch user on network reconnect
        if (shouldFetchUserOnNetworkReconnect && !isInternetNotReachable) {
            (async () => {
                await fetchAndSetUser();
                setShouldFetchUserOnNetworkReconnect(false);
            })();
        }

        // Subscription for detecting if the app is resumed from background
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                queryClient.invalidateQueries({ queryKey: ['getSelf'] });
                if (!isInternetNotReachable) {
                    await fetchAndSetUser();
                } else {
                    setShouldFetchUserOnNetworkReconnect(true);
                }
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [dispatch, fetchAndSetUser, isInternetNotReachable, setUser, shouldFetchUserOnNetworkReconnect]);

    useEffect(() => {
        if (!user) return;

        if (!isSelfCare(user)) {
            const navigationState = navigation.getState();
            const isAlreadyWebView = navigationState?.routes.some((route) => route.name === 'WebView');

            if (isAlreadyWebView) return;

            navigation.reset({ index: 0, routes: [{ name: 'WebView' }] });
        }
    }, [navigation, user]);
};

export default useOnProgramLevelSwitch;
