import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import SettingsBrowserRow from './SettingsBrowserRow';
import SettingsClickableRow from './SettingsClickableRow';
import SettingsDialogRow from './SettingsDialogRow';
import SettingsEditRow from './SettingsEditRow';
import SettingsNonEditRow from './SettingsNonEditRow';
import SettingsPickerRow from './SettingsPickerRow';
import SettingsSignOutRow from './SettingsSignOutRow';
import { Notification, NotificationSettings } from '@src/services/settings';
import { Profile, User } from '@src/services/user';

export enum RowTypeEnum {
    EDIT = 'edit',
    NON_EDIT = 'nonEdit',
    OPEN_DIALOG = 'openDialog',
    OPEN_BROWSER = 'openBrowser',
    SIGN_OUT = 'signOut',
    CLICKABLE = 'clickable',
    PICKER = 'picker',
}

export type RowType = {
    label: string;
    property?: keyof Profile;
    type: RowTypeEnum;
    url?: string;
    callback?: () => void;
    notificationProperty?: keyof NotificationSettings;
    options?: Notification[];
};

type Props = {
    index: number;
    userProfile: Profile;
    setUserProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>;
    item: RowType;
    user: User;
    userNotificationSettings: NotificationSettings;
};

const SettingsRow: FunctionComponent<Props> = ({
    index,
    userProfile,
    setUserProfile,
    item,
    user,
    userNotificationSettings,
}) => {
    const renderRow = (type: RowTypeEnum) => {
        switch (type) {
            case RowTypeEnum.EDIT:
                return (
                    <SettingsEditRow
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        item={item}
                        key={item.property}
                    />
                );
            case RowTypeEnum.NON_EDIT:
                return <SettingsNonEditRow item={item} key={item.property} user={user} />;
            case RowTypeEnum.OPEN_DIALOG:
                return <SettingsDialogRow item={item} key={item.property} user={user} />;
            case RowTypeEnum.OPEN_BROWSER:
                return <SettingsBrowserRow item={item} key={item.property} />;
            case RowTypeEnum.CLICKABLE:
                return <SettingsClickableRow item={item} key={item.property} />;
            case RowTypeEnum.SIGN_OUT:
                return <SettingsSignOutRow item={item} key={item.property} />;
            case RowTypeEnum.PICKER:
                return (
                    <SettingsPickerRow
                        item={item}
                        key={item.property ?? item.notificationProperty}
                        userNotificationSettings={userNotificationSettings}
                    />
                );
            default:
                return null;
        }
    };

    return <Row isFirst={index === 0}>{renderRow(item.type)}</Row>;
};

const Row = styled.View<{ isFirst: boolean }>`
    background-color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.gray300};
    width: 100%;
    border-top-width: ${({ isFirst }) => (isFirst ? '1px' : '0px')};
    border-bottom-width: 1px;
    flex-direction: row;
    padding-left: 20px;
    padding-right: 35px;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 15px;
`;

export default SettingsRow;
