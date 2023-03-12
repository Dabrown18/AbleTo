import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

import { RowType } from './SettingsRow';
import { BodyText } from '@src/core';
import useDidMount from '@src/hooks/useDidMount';
import { dialogActions } from '@src/redux/slices/dialogSlice';
import { idpPasswordReset } from '@src/services/idp';
import Logger from '@src/services/logger';
import { User } from '@src/services/user';

type Props = {
    item: RowType;
    user: User;
};

const SettingsDialogRow: FunctionComponent<Props> = ({ item, user }) => {
    const dispatch = useDispatch();
    const { setUserEmail, setShouldShowResetPasswordDialog } = dialogActions;

    useDidMount(() => {
        if (user.email) dispatch(setUserEmail(user.email));
    });

    const onPress = async () => {
        if (!user.email) return;

        try {
            await idpPasswordReset(user.email);
        } catch (error) {
            Logger.error(error, "Couldn't send a reset password email");
            return;
        }
        dispatch(setShouldShowResetPasswordDialog(true));
    };

    return (
        <StyledPressable onPress={onPress}>
            <RowHeader accessibilityRole="button">{item.label}</RowHeader>
        </StyledPressable>
    );
};

const StyledPressable = styled.Pressable`
    width: 100%;
`;

const RowHeader = styled(BodyText)`
    color: ${({ theme }) => theme.colors.primary600};
`;

export default SettingsDialogRow;
