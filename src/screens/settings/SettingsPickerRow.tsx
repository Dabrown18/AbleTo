import { useFocusEffect } from '@react-navigation/native';
import React, { FunctionComponent, useMemo, useRef, useState } from 'react';
import { AppState, ColorSchemeName, Pressable, useColorScheme } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

import { RowType } from './SettingsRow';
import { BodyText } from '@src/core';
import useDidMount from '@src/hooks/useDidMount';
import useTranslation from '@src/hooks/useTranslation';
import { dialogActions } from '@src/redux/slices/dialogSlice';
import { checkNotificationsAllowed, showNotificationPrompt } from '@src/services/notifications';
import {
    Notification,
    notification as notificationArr,
    NotificationSettings,
    updateNotificationSetting,
} from '@src/services/settings';

type Props = {
    item: RowType;
    userNotificationSettings: NotificationSettings;
};

const isNotificationType = (value: any): value is Notification => notificationArr.includes(value);

const SettingsPickerRow: FunctionComponent<Props> = ({ item, userNotificationSettings }) => {
    const { t } = useTranslation('notification_settings');

    const notificationTypes = useMemo(() => t('type', { returnObjects: true }) as Record<Notification, string>, [t]);
    const notificationSetting = useMemo(
        () => userNotificationSettings[item.notificationProperty!] as Notification,
        [item.notificationProperty, userNotificationSettings]
    );

    const dispatch = useDispatch();
    const { setShouldShowSettingsDialog } = dialogActions;

    const [selectedValue, setSelectedValue] = useState(notificationSetting);
    const [valueToBeSelected, setValueToBeSelected] = useState(notificationSetting);
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const appState = useRef(AppState.currentState);

    const colorScheme = useColorScheme();

    const setNotificationPreference = async (notificationPreference: Notification) => {
        setSelectedValue(notificationPreference);

        const key = item.notificationProperty!;
        await updateNotificationSetting({ [key]: notificationPreference });
    };

    useFocusEffect(() => {
        // We want to check if we have any changes related to the notification
        // settings when the use returns from native Android settings to our app
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                const areNotificationsAllowed = await checkNotificationsAllowed();

                if (valueToBeSelected === Notification.PUSH && areNotificationsAllowed) {
                    setNotificationPreference(Notification.PUSH);
                } else if (selectedValue === Notification.PUSH && !areNotificationsAllowed) {
                    setNotificationPreference(Notification.NONE);
                }
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    });

    useDidMount(() => {
        (async () => {
            if (selectedValue === Notification.PUSH && (await checkNotificationsAllowed()) === false) {
                setNotificationPreference(Notification.NONE);

                const isRequestable = await showNotificationPrompt();

                // Check if we can show native dialog for notification
                // permission on Android higher than 13
                if (isRequestable) {
                    const areNotificationsAllowed = await checkNotificationsAllowed();
                    if (areNotificationsAllowed) setNotificationPreference(Notification.PUSH);
                } else {
                    dispatch(setShouldShowSettingsDialog(true));
                }
            }
        })();
    });

    const onValueChange = async (value: any) => {
        setIsPickerVisible(false);

        if (!isNotificationType(value)) return;

        setValueToBeSelected(value);
        if (value === Notification.PUSH && (await checkNotificationsAllowed()) === false) {
            dispatch(setShouldShowSettingsDialog(true));
        } else {
            setSelectedValue(value);
            const key = item.notificationProperty!;
            await updateNotificationSetting({ [key]: value });
        }
    };

    return (
        <>
            <RowHeader>{item.label}</RowHeader>
            <StyledPressable onPress={() => setIsPickerVisible(true)}>
                <StyledText>{notificationTypes[selectedValue]}</StyledText>
            </StyledPressable>
            <Portal>
                <Dialog visible={isPickerVisible} onDismiss={() => setIsPickerVisible(false)}>
                    <Dialog.Content>
                        {item.options?.map((type, idx) => (
                            <Pressable key={idx} onPress={() => onValueChange(type)}>
                                <StyledItem colorScheme={colorScheme}>{notificationTypes[type]}</StyledItem>
                            </Pressable>
                        ))}
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </>
    );
};

const RowHeader = styled(BodyText)`
    color: ${({ theme }) => theme.colors.gray700};
    width: 160px;
`;

const StyledPressable = styled.Pressable`
    flex-direction: column;
    min-width: 50%;
    color: ${({ theme }) => theme.colors.gray900};
`;

const StyledItem = styled(BodyText)<{ colorScheme: ColorSchemeName }>`
    margin: 10px 0px;
    font-size: 18px;
    ${({ theme, colorScheme }) => colorScheme === 'dark' && `color: ${theme.colors.gray100};`}
`;

const StyledText = styled(BodyText)`
    color: ${({ theme }) => theme.colors.gray900};
`;

export default SettingsPickerRow;
