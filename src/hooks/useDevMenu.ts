import crashlytics from '@react-native-firebase/crashlytics';
import { DevSettings } from 'react-native';
import { useDispatch } from 'react-redux';

import useActivity from './useActivity';
import useAuth from './useAuth';
import useDidMount from './useDidMount';
import { devMenuActions } from '@src/redux/slices/devMenuSlice';
import { serverActions } from '@src/redux/slices/serverSlice';
import analytics from '@src/services/analytics/analytics';
import { clear as clearStorage } from '@src/services/storage';

/**
 * A place to list all of the custom DevMenu items that we want.
 * In dev build these are added to the React Native DevSettings menu.
 * In staging builds these are added in a custom DebugMenu component.
 * In production these are ignored completely.
 */
const useDevMenu = () => {
    const dispatch = useDispatch();
    const { onSessionExpiration } = useAuth();
    const { toggleForceNativeActivities } = useActivity();
    const { setToggleMeTab } = devMenuActions;

    const menuItems = [
        {
            title: 'Force Reauth',
            callback: onSessionExpiration,
        },
        {
            title: 'Switch Server',
            callback: () => dispatch(serverActions.showSelector()),
        },
        {
            title: 'Crash App',
            callback: () => {
                crashlytics().crash();
            },
        },
        {
            title: 'Throw an error',
            callback: () => [0][1].toString(),
        },
        {
            title: 'Clear Storage',
            callback: clearStorage,
        },
        {
            title: 'Toggle Force Native Activities On',
            callback: () => toggleForceNativeActivities(true),
        },
        {
            title: 'Toggle Force Native Activities Off',
            callback: () => toggleForceNativeActivities(false),
        },
        {
            title: 'Send Mixpanel QA Event',
            callback: () => analytics.tapped('Mixpanel QA Event'),
        },
        {
            title: 'Toggle Me Tab On',
            callback: () => dispatch(setToggleMeTab(true)),
        },
        {
            title: 'Toggle Me Tab Off',
            callback: () => dispatch(setToggleMeTab(false)),
        },
    ];

    useDidMount(() => {
        menuItems.forEach((item) => DevSettings.addMenuItem(item.title, item.callback));
    });

    return { menuItems };
};

export default useDevMenu;
