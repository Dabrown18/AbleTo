import React, { FunctionComponent, useCallback, useState } from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';

import DialogTitle from '@src/components/dialogs/DialogTitle';
import { BodyText, HeaderText, PrimaryButton } from '@src/core';
import Popup from '@src/core/Dialog/CustomDialog';
import useTranslation from '@src/hooks/useTranslation';
import { sendMessageToSupport } from '@src/services/settings';

const Support: FunctionComponent = () => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMessageSendDialog, setShowMessageSendDialog] = useState(false);
    const MESSAGE_MAX_LENGTH = 2000;

    const sendMessage = () => {
        setShowErrorMessage(false);
        sendMessageToSupport(message);
        setMessage('');
        setShowMessageSendDialog(true);
    };

    const onChange = useCallback(
        (newQuery: string) => {
            setMessage(newQuery);

            const charactersRemaining = MESSAGE_MAX_LENGTH - newQuery.length;

            if (charactersRemaining <= 15) {
                setShowErrorMessage(true);
                setErrorMessage(
                    t(
                        charactersRemaining === 1
                            ? 'support.character_limit_warning'
                            : 'support.character_limit_warning_count',
                        {
                            count: charactersRemaining,
                        }
                    )
                );
            } else {
                setShowErrorMessage(false);
            }
        },
        [t]
    );

    return (
        <StyledScrollView>
            <SupportContainer>
                <HeaderText variant="h4">{t('support.form.label')}</HeaderText>
                <TextScrollView>
                    <AdditionalText
                        value={message}
                        underlineColorAndroid="transparent"
                        maxLength={MESSAGE_MAX_LENGTH}
                        textAlignVertical="top"
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={onChange}
                    />
                </TextScrollView>
                {showErrorMessage && (
                    <ErrorMessage accessibilityLiveRegion="polite" variant="sm">
                        {errorMessage}
                    </ErrorMessage>
                )}
                <BodyText variant="sm">{t('support.form.description')}</BodyText>
                <StyledView>
                    <StyledPrimaryButton
                        disabled={!message.trim()}
                        title={t('general.buttons.send')}
                        onPress={sendMessage}
                    />
                </StyledView>
                {showMessageSendDialog && (
                    <Popup
                        titleContent={<DialogTitle title={t('support.support.header')} />}
                        bodyContent={<BodyText>{t('support.support.sub_header')}</BodyText>}
                        onDismiss={() => setShowMessageSendDialog(false)}
                        actionsContent={
                            <PrimaryButton
                                wide
                                title={t('general.buttons.close')}
                                onPress={() => setShowMessageSendDialog(false)}
                            />
                        }
                    />
                )}
            </SupportContainer>
        </StyledScrollView>
    );
};

const StyledScrollView = styled.ScrollView`
    background-color: ${({ theme }) => theme.colors.creamBackground};
`;

const SupportContainer = styled.View`
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.white};
`;

const StyledView = styled.View`
    align-items: flex-start;
`;

const StyledPrimaryButton = styled(PrimaryButton)`
    margin-top: 24px;
`;

const AdditionalText = styled(TextInput)`
    color: ${(props) => props.theme.colors.cream800};
`;

const ErrorMessage = styled(BodyText)`
    color: ${(props) => props.theme.colors.red600};
`;

const TextScrollView = styled.ScrollView`
    margin: 8px 0;
    padding: 0px 16px;
    border-radius: 4px;
    border: ${(props) => `1px solid ${props.theme.colors.cream200}`};
    height: 100px;
`;

export default Support;
