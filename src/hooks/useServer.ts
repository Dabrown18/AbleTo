import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import serverConfigs, { ServerConfiguration } from '@src/config/server';
import initializeFirebaseApp from '@src/firebase/initializeFirebaseApp';
import { serverActions } from '@src/redux/slices/serverSlice';
import platformAnalytics from '@src/services/analytics/platformAnalytics';
import { switchAxiosBaseURL } from '@src/services/request';
import { setItem } from '@src/services/storage';

const useServer = () => {
    const dispatch = useDispatch();
    const { setServer } = serverActions;
    const PERSISTED_SERVER_KEY = 'PERSISTED_SERVER_KEY';

    const changeServer = useCallback(
        async (server: ServerConfiguration) => {
            dispatch(setServer(server));

            setItem(PERSISTED_SERVER_KEY, server);

            switchAxiosBaseURL(server.apiUrl);
            platformAnalytics.switchBaseURL(server.ableToApiUrl);

            const isServerProd = server.name === serverConfigs.production.name;
            const isServerLocal = server.name === serverConfigs.local.name || server.baseUrl.includes('10.0.2.2');

            const AUTH_APP = isServerProd ? 'AUTH_PRODUCTION' : isServerLocal ? 'AUTH_LOCAL' : 'AUTH_STAGING';
            const FCM_APP = isServerProd ? 'FCM_PRODUCTION' : 'FCM_STAGING';

            await initializeFirebaseApp(AUTH_APP);
            await initializeFirebaseApp(FCM_APP);
        },
        [dispatch, setServer]
    );

    return { changeServer };
};

export default useServer;
