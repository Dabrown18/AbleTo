import { useLinkTo } from '@react-navigation/native';
import React, { useState } from 'react';
import styled from 'styled-components/native';

import { HeaderText, Icon } from '@src/core';
import colors from '@src/core/colors';
import useDidMount from '@src/hooks/useDidMount';
import { getSelf } from '@src/services/user';

const MeHeader = () => {
    const [fullName, setFullName] = useState<string | undefined>(undefined);
    const linkTo = useLinkTo();

    useDidMount(() => {
        (async () => {
            const response = await getSelf();
            const profile = response.profiles.find((p) => p.user_id === response.user.id);

            setFullName(`${profile?.first_name} ${profile?.last_name?.charAt(0)}.`);
        })();
    });

    return (
        <StyledView>
            <FullNameContainer>{fullName && <StyledHeaderText>{fullName}</StyledHeaderText>}</FullNameContainer>
            <SettingsButtonContainer onPress={() => linkTo('/settings')}>
                <Icon icon="settingsFocused" size={26} color={colors.primary600} />
            </SettingsButtonContainer>
        </StyledView>
    );
};

const StyledView = styled.View`
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 20px 20px 0 20px;
`;

const StyledHeaderText = styled(HeaderText)`
    font-size: 48px;
    line-height: 53px;
`;

const FullNameContainer = styled.View`
    flex: 1;
`;

const SettingsButtonContainer = styled.Pressable`
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
`;

export default MeHeader;
