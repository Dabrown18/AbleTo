import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import styled from 'styled-components/native';

import { RowType, RowTypeEnum } from './SettingsRow';
import SettingsSection from './SettingsSection';
import { LoadingIndicator } from '@src/core';
import useDidMount from '@src/hooks/useDidMount';
import useTranslation from '@src/hooks/useTranslation';
import { RootStackParamList } from '@src/services/activities/types';
import { getNotificationSettings, Notification, NotificationSettings } from '@src/services/settings';
import { getSelf, Profile, User } from '@src/services/user';

export type Section = {
    label: string;
    rows: RowType[];
};

const Settings = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [user, setUser] = useState<User>();
    const [userProfile, setUserProfile] = useState<Profile>();
    const [userNotificationSettings, setUserNotificationSettings] = useState<NotificationSettings>();

    const { t } = useTranslation();
    const { t: tProfile } = useTranslation('profile');
    const { t: tSupport } = useTranslation('support');

    const sections: Section[] = [
        {
            label: tProfile('your_profile'),
            rows: [
                { label: tProfile('first_name'), property: 'first_name', type: RowTypeEnum.EDIT },
                { label: tProfile('last_name'), property: 'last_name', type: RowTypeEnum.EDIT },
                { label: tProfile('email_address'), type: RowTypeEnum.NON_EDIT },
                { label: tProfile('reset_password'), type: RowTypeEnum.OPEN_DIALOG },
            ],
        },
        {
            label: t('general.settings_menu.notifications'),
            rows: [
                {
                    label: t('notification_settings.field.marketing_communications'),
                    notificationProperty: 'marketing_communications_type',
                    type: RowTypeEnum.PICKER,
                    options: [Notification.PUSH, Notification.EMAIL, Notification.NONE],
                },
                {
                    label: t('notification_settings.field.mood_tracking_reminders'),
                    notificationProperty: 'mood_tracking_reminder_type',
                    type: RowTypeEnum.PICKER,
                    options: [Notification.PUSH, Notification.NONE],
                },
            ],
        },
        {
            label: tProfile('more'),
            rows: [
                {
                    label: tProfile('terms_of_use'),
                    type: RowTypeEnum.OPEN_BROWSER,
                    url: 'https://www.ableto.com/termsofuse/',
                },
                {
                    label: tProfile('privacy_policy'),
                    type: RowTypeEnum.OPEN_BROWSER,
                    url: 'https://www.ableto.com/privacy/',
                },
                {
                    label: tSupport('header'),
                    type: RowTypeEnum.CLICKABLE,
                    callback: () => {
                        navigation.navigate('Support');
                    },
                },
                {
                    label: tProfile('log_out'),
                    type: RowTypeEnum.SIGN_OUT,
                },
            ],
        },
    ];

    useDidMount(() => {
        if (!userProfile || !user) {
            (async () => {
                setUser((await getSelf()).user);
                setUserProfile((await getSelf()).profiles[0]);
            })();
        }

        if (!userNotificationSettings) {
            (async () => {
                setUserNotificationSettings(await getNotificationSettings());
            })();
        }
    });

    if (!userProfile || !user || !userNotificationSettings) return <LoadingIndicator />;

    return (
        <StyledScrollView>
            <StyledView>
                {sections.map((section) => {
                    return (
                        <SettingsSection
                            userProfile={userProfile}
                            section={section}
                            setUserProfile={setUserProfile}
                            key={section.label}
                            user={user}
                            userNotificationSettings={userNotificationSettings}
                        />
                    );
                })}
            </StyledView>
        </StyledScrollView>
    );
};

const StyledScrollView = styled.ScrollView`
    background-color: ${({ theme }) => theme.colors.creamBackground};
`;

const StyledView = styled.View`
    padding: 20px 0 0 0;
`;

export default Settings;
