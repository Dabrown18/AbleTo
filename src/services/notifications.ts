import notifee from '@notifee/react-native';
import { checkNotifications, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import { Data } from './messaging';

// Notifee requires to have a background event set
notifee.onBackgroundEvent(async () => {
    await Promise.resolve();
});

let channelId = '';

const setChannelId = async () => {
    if (!channelId) {
        channelId = await notifee.createChannel({
            id: 'joyable',
            name: 'Joyable',
        });
    }
};

export const displayNotification = async (data: Data) => {
    await setChannelId();

    await notifee.displayNotification({
        title: data?.title,
        body: data?.body,
        android: {
            channelId,
            smallIcon: 'ic_notification_ableto',
            showTimestamp: true,
            pressAction: { id: 'default' },
        },
    });
};

const checkNotificationsPermission = async () => {
    return (await checkNotifications()).status;
};

export const checkNotificationsAllowed = async () => {
    const permissionStatus = await checkNotificationsPermission();

    return permissionStatus === RESULTS.GRANTED;
};

/**
 * Shows a notification prompt if possible.
 * The prompt is visible only on Android 13 (API Level 33)
 * or above. We can show it no more than 2 times.
 * @returns `true` if the prompt is shown, `false` if the prompt can't be shown
 * and `null` if there's no need to show the prompt (permission is granted)
 */
export const showNotificationPrompt = async () => {
    // In case we open the app with device version lower than Android 13
    // we will receive permissionStatus 'unavailable' and no logic will be executed
    const permissionStatus = await checkNotificationsPermission();
    // Result is DENIED only in case the permission has not been requested to the user yet or was denied more than once.
    // We can only request permission twice.
    // If the user was already presented with request popup and denied more than once
    // we consider the next request 'blocked' and users can only allow permission again from the settings
    if (permissionStatus === RESULTS.DENIED) {
        const requestStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

        return !(requestStatus === RESULTS.BLOCKED || requestStatus === RESULTS.UNAVAILABLE);
    }
    return null;
};
