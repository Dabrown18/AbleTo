import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

import PrimaryButton from '../Button/PrimaryButton';
import SecondaryButton from '../Button/SecondaryButton';
import TertiaryButton from '../Button/TertiaryButton';
import BodyText from '../Text/BodyText';
import HeaderText from '../Text/HeaderText';
import CustomDialog from './CustomDialog';

type Props = {
    title: string;
    body: string;
    confirmButtonMessage: string;
    declineButtonMessage?: string;
    dismissable?: boolean;
    buttonDirection?: 'column' | 'row';
    onPrimaryAction: () => void;
    onSecondaryAction?: () => void;
    onDismiss: () => void;
};

const ConfirmationDialog: FunctionComponent<Props> = ({
    title,
    body,
    confirmButtonMessage,
    declineButtonMessage,
    dismissable = true,
    buttonDirection = 'column',
    onPrimaryAction,
    onSecondaryAction,
    onDismiss,
    ...rest
}) => {
    const titleJsx = <HeaderText variant="h3">{title}</HeaderText>;
    const bodyJsx = <BodyText>{body}</BodyText>;
    const actionsJsx = (
        <StyledView buttonDirection={buttonDirection}>
            <StyledRow buttonDirection={buttonDirection}>
                <PrimaryButton title={confirmButtonMessage} wide onPress={onPrimaryAction} />
            </StyledRow>
            {declineButtonMessage ? (
                <StyledRow buttonDirection={buttonDirection}>
                    {buttonDirection === 'column' ? (
                        <StyledTertiaryButton title={declineButtonMessage} wide onPress={onSecondaryAction} />
                    ) : (
                        <StyledSecondaryButton title={declineButtonMessage} wide onPress={onSecondaryAction} />
                    )}
                </StyledRow>
            ) : null}
        </StyledView>
    );

    return (
        <CustomDialog
            titleContent={titleJsx}
            bodyContent={bodyJsx}
            actionsContent={actionsJsx}
            dismissable={dismissable}
            onDismiss={onDismiss}
            {...rest}
        />
    );
};

const StyledRow = styled(View)<{ buttonDirection: 'column' | 'row' }>`
    display: flex;
    flex: ${(props) => (props.buttonDirection === 'row' ? '1' : '0 1 auto')};
`;

const StyledView = styled(View)<{ buttonDirection: 'column' | 'row' }>`
    flex-direction: ${(props) => (props.buttonDirection === 'row' ? 'row-reverse' : 'column')};
`;

const StyledTertiaryButton = styled(TertiaryButton)`
    margin-top: 20px;
`;

const StyledSecondaryButton = styled(SecondaryButton)`
    margin-right: 10px;
`;

export default ConfirmationDialog;
