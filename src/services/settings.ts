import Logger from './logger';
import request from './request';

export enum Notification {
    PUSH = 'push',
    EMAIL = 'email',
    SMS = 'sms',
    NONE = 'none',
}
export const notification = [Notification.PUSH, Notification.EMAIL, Notification.SMS, Notification.NONE];

export type NotificationSettings = {
    call_reminder_type: Notification;
    id: number;
    marketing_communications_type: Notification;
    mood_tracking_reminder_type: Notification;
    notification_type: Notification;
    weeks_reminder_type: Notification;
};

export const sendMessageToSupport = (message: string) => {
    try {
        request.post(`/support_requests`, {
            support_request: { request_description: message },
        });
    } catch (error) {
        Logger.error(error, `Failed to send message to support`);
    }
};

/**
 * Gets the current user's notification preferences
 * from the `notification_settings` table
 */
export const getNotificationSettings = async (): Promise<NotificationSettings | undefined> => {
    try {
        const { data } = await request.get('notification_settings');
        return data.notification_settings;
    } catch (error) {
        Logger.error(error, 'Failed to get notification settings');
        return;
    }
};

/**
 * Sends a PUT request to update a notification setting
 * (in the `notification_settings` table) for the current user
 */
export const updateNotificationSetting = async (settingToUpdate: Record<string, Notification>) => {
    try {
        await request.put('notification_settings', { notification_settings: settingToUpdate });
    } catch (error) {
        Logger.error(error, 'Failed to update notification settings');
    }
};
