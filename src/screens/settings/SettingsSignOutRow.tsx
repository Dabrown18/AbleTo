import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { RowType } from './SettingsRow';
import { BodyText } from '@src/core';
import useAuth from '@src/hooks/useAuth';

type Props = {
    item: RowType;
};

const SettingsSignOutRow: FunctionComponent<Props> = ({ item }) => {
    const { logout } = useAuth();

    return (
        <StyledPressable onPress={() => logout()}>
            <PurpleText accessibilityRole="button">{item.label}</PurpleText>
        </StyledPressable>
    );
};

const PurpleText = styled(BodyText)`
    color: ${({ theme }) => theme.colors.primary600};
`;

const StyledPressable = styled.Pressable`
    width: 100%;
`;

export default SettingsSignOutRow;
