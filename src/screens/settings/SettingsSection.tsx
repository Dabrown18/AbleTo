import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { Section as SectionType } from './Settings';
import SettingsRow from './SettingsRow';
import { BodyText } from '@src/core';
import { NotificationSettings } from '@src/services/settings';
import { Profile, User } from '@src/services/user';

type Props = {
    userProfile: Profile;
    section: SectionType;
    setUserProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>;
    user: User;
    userNotificationSettings: NotificationSettings;
};

const SettingsSection: FunctionComponent<Props> = ({
    userProfile,
    section,
    setUserProfile,
    user,
    userNotificationSettings,
}) => {
    return (
        <Section>
            <SectionHeader>{section.label}</SectionHeader>
            {section.rows.map((row, rowIndex) => {
                return (
                    <SettingsRow
                        key={rowIndex}
                        index={rowIndex}
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        item={row}
                        user={user}
                        userNotificationSettings={userNotificationSettings}
                    />
                );
            })}
        </Section>
    );
};

const Section = styled.View`
    margin-bottom: 32px;
`;

const SectionHeader = styled(BodyText)`
    margin-bottom: 8px;
    margin-left: 20px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.black};
`;

export default SettingsSection;
