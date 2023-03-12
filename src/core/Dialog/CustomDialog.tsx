import React, { FunctionComponent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components';

import Icon from '../Icon/Icon';
import useScreenReader from '@src/hooks/useScreenReader';

type Props = {
    showCloseButton?: boolean;
    titleContent?: ReactNode;
    bodyContent: ReactNode;
    actionsContent?: ReactNode;
    dismissable?: boolean;
    onDismiss?: () => void;
    innerWidth?: number;
};

const Popup: FunctionComponent<Props> = ({
    showCloseButton,
    titleContent,
    bodyContent,
    actionsContent,
    dismissable = true,
    onDismiss,
    innerWidth,
    ...rest
}) => {
    const isSREanbled = useScreenReader();
    const { t } = useTranslation();

    // Tapping outside the modal to dismiss it
    // messes up screen reader focusability,
    // so we do not render the touchables,
    // if a Screen Reader is currently enabled
    if (isSREanbled) {
        return (
            <Modal animationType="fade" transparent onRequestClose={onDismiss} {...rest}>
                <OuterContainer>
                    <InnerContainer innerWidth={innerWidth!}>
                        <DialogHeader>
                            <Title hasCloseButton={!!showCloseButton}>{titleContent}</Title>
                            {showCloseButton && (
                                <CloseButton
                                    accessible
                                    accessibilityRole="button"
                                    accessibilityLabel={t('general.buttons.close')}
                                    onPress={onDismiss}
                                >
                                    <Icon size={11} icon="close" />
                                </CloseButton>
                            )}
                        </DialogHeader>
                        <Body>{bodyContent}</Body>
                        <View>{actionsContent}</View>
                    </InnerContainer>
                </OuterContainer>
            </Modal>
        );
    }

    return (
        <Modal animationType="fade" transparent onRequestClose={onDismiss} {...rest}>
            <TouchableWithoutFeedback
                testID={dismissable ? 'Dismissable' : 'Not Dismissable'}
                onPress={dismissable ? onDismiss : undefined}
            >
                <OuterContainer>
                    <TouchableWithoutFeedback>
                        <InnerContainer innerWidth={innerWidth!}>
                            <DialogHeader>
                                <Title hasCloseButton={!!showCloseButton}>{titleContent}</Title>
                                {showCloseButton && (
                                    <CloseButton onPress={onDismiss}>
                                        <Icon size={11} icon="close" />
                                    </CloseButton>
                                )}
                            </DialogHeader>
                            <Body>{bodyContent}</Body>
                            <View>{actionsContent}</View>
                        </InnerContainer>
                    </TouchableWithoutFeedback>
                </OuterContainer>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const OuterContainer = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.grayTransparent900};
`;

const InnerContainer = styled(View)<{ innerWidth: number }>`
    width: ${(props) => (props.innerWidth ? props.innerWidth + 'px' : 'auto')};
    border-radius: 12px;
    padding: 20px 18px;
    margin: 0px 20px;
    background-color: ${({ theme }) => theme.colors.white};
`;

const DialogHeader = styled.View`
    position: relative;
    justify-content: center;
`;

const CloseButton = styled.TouchableOpacity`
    position: absolute;
    top: 0;
    right: 0;
`;

const Title = styled(View)<{ hasCloseButton: boolean }>`
    margin-top: ${(props) => (props.hasCloseButton ? '22px' : '0')};
    margin-bottom: 8px;
`;

const Body = styled.View`
    margin-bottom: 18px;
`;

export default Popup;
