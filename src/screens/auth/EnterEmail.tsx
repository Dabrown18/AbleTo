import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import AuthFooter from '@src/components/auth/AuthFooter';
import AuthHeader from '@src/components/auth/AuthHeader';
import ScreenScrollView from '@src/components/ScreenScrollView';
import { LoadingIndicator, PrimaryButton, TextInput } from '@src/core/';
import ConfirmationDialog from '@src/core/Dialog/ConfirmationDialog';
import fonts from '@src/core/fonts';
import LabelText from '@src/core/Text/LabelText';
import useTranslation from '@src/hooks/useTranslation';
import { AuthStackParamList } from '@src/navigation/AuthStack';
import { selectServer } from '@src/redux/slices/serverSlice/selectors';
import { attemptToLogin } from '@src/services/auth';
import { openLink } from '@src/services/helpers';
import { emailHasIdpPassword } from '@src/services/idp';
import Logger from '@src/services/logger';
import { emailValidation } from '@src/validators/auth';

type ScreenProps = StackScreenProps<AuthStackParamList, 'EnterEmail'>;

type FormData = {
    email: string;
};

export enum ErrorMessages {
    SESSION_TIMED_OUT = 'general.errors.timed_out',
}

const EnterEmail: FunctionComponent<ScreenProps> = ({ navigation, route }) => {
    const [showRedirectDialog, setShowRedirectDialog] = useState(false);
    const [redirectEmail, setRedirectEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const server = useSelector(selectServer);

    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
        },
        mode: 'onBlur',
        shouldFocusError: true,
    });

    const handlePress = useCallback(
        async ({ email }: FormData) => {
            try {
                const trimmedEmail = email.trim();
                setIsLoading(true);
                const errorMessage = await attemptToLogin(trimmedEmail);

                if (errorMessage === 'user_not_found' || errorMessage === 'password_missing_onboarding_incomplete') {
                    setIsLoading(false);
                    return navigation.push('CheckYourEmail', { email: trimmedEmail });
                }

                if (errorMessage === 'idp_required') {
                    const hasFirebasePassword = await emailHasIdpPassword(email);

                    if (!hasFirebasePassword) {
                        setIsLoading(false);
                        setRedirectEmail(email);
                        setShowRedirectDialog(true);
                        return;
                    }
                }

                navigation.push('EnterPassword', { email: trimmedEmail });
            } catch (error) {
                Logger.error(error, 'Failed to fetch idp sign in methods');
            } finally {
                setIsLoading(false);
            }
        },
        [navigation]
    );

    const redirectToBrowser = () => {
        dismissDialog();
        return openLink(`${server.baseUrl}/?verify_email=${encodeURIComponent(redirectEmail)}`);
    };

    const dismissDialog = () => {
        setRedirectEmail('');
        setShowRedirectDialog(false);
    };

    return (
        <ScreenScrollView>
            <AuthHeader title={t('log_in.welcome_back')} />

            <Controller
                name="email"
                control={control}
                rules={emailValidation()}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        accessibilityLabel={t('log_in.email_a11y_label')}
                        label={t('profile.email_address')}
                        value={value}
                        mode="outlined"
                        error={errors.email?.message || (route.params?.message && t(route.params?.message))}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onSubmitEditing={handleSubmit(handlePress)}
                        autoCapitalize="none"
                    />
                )}
            />

            <TermsContainer>
                <StyledLabelText>{t('log_in.terms')}</StyledLabelText>
            </TermsContainer>

            <AuthFooter>
                <PrimaryButton title={t('general.buttons.next')} wide onPress={handleSubmit(handlePress)} />
            </AuthFooter>

            {isLoading && <LoadingIndicator fullScreen />}
            {showRedirectDialog && (
                <ConfirmationDialog
                    title={t('log_in.leaving_app_create_password.title')}
                    body={t('log_in.leaving_app_create_password.body')}
                    confirmButtonMessage={t('general.buttons.ok')}
                    declineButtonMessage={t('general.buttons.cancel')}
                    onPrimaryAction={redirectToBrowser}
                    onSecondaryAction={dismissDialog}
                    onDismiss={dismissDialog}
                    buttonDirection="row"
                />
            )}
        </ScreenScrollView>
    );
};

const TermsContainer = styled(View)`
    margin-top: auto;
`;

const StyledLabelText = styled(LabelText)`
    font-family: ${fonts.FAKT_PRO_NORMAL};
    font-size: 14px;
    line-height: 16px;
    margin-top: 20px;
    letter-spacing: 0px;
    font-weight: 400;
`;

export default EnterEmail;
