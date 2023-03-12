import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AuthStackParamList } from 'src/navigation/AuthStack';
import styled from 'styled-components/native';

import AuthFooter from '@src/components/auth/AuthFooter';
import AuthHeader from '@src/components/auth/AuthHeader';
import ScreenScrollView from '@src/components/ScreenScrollView';
import { LinkButton, LoadingIndicator, PasswordInput, PrimaryButton, TextInput } from '@src/core/';
import BodyText from '@src/core/Text/BodyText';
import useAuth from '@src/hooks/useAuth';
import useBackHandler from '@src/hooks/useBackHandler';
import { selectIsLoading } from '@src/redux/slices/authSlice/selectors';
import { sendPasswordReset } from '@src/services/auth';
import { translate } from '@src/services/i18n';
import { otpValidation, passwordValidation } from '@src/validators/auth';

type ScreenProps = StackScreenProps<AuthStackParamList, 'EnterOTP'>;

const EnterOTP: FunctionComponent<ScreenProps> = ({ navigation, route }) => {
    const [showPassword, setShowPassword] = useState(false);

    const { t } = useTranslation();

    const { email } = route.params;
    const { login } = useAuth();
    const isLoading = useSelector(selectIsLoading);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            password: route.params.password ?? '',
            otp: '',
        },
        mode: 'onBlur',
        shouldFocusError: true,
    });

    const handlePress = useCallback(
        async ({ password, otp }: { password: string; otp: string }) => {
            try {
                await login(email, password, otp);
            } catch ({ message }) {
                setError('otp', { message: translate(message) });
            }
        },
        [email, login, setError]
    );

    useBackHandler(() => {
        navigation.navigate('EnterEmail');
        return true;
    });

    const handlePasswordReset = useCallback(async () => {
        sendPasswordReset(email);
        navigation.navigate('CheckYourEmail', { email });
    }, [email, navigation]);

    return (
        <ScreenScrollView>
            <AuthHeader title={t('log_in.welcome_back')} />

            <Controller
                name="password"
                control={control}
                rules={passwordValidation()}
                render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                        accessibilityLabel={t('log_in.password_a11y_label')}
                        label={t('log_in.password')}
                        value={value}
                        error={errors.password?.message}
                        hideInput={!showPassword}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onSubmitEditing={handleSubmit(handlePress)}
                        toggleShowPassword={() => setShowPassword((isShowing) => !isShowing)}
                    />
                )}
            />

            <Controller
                name="otp"
                control={control}
                rules={otpValidation()}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        accessibilityLabel={t('log_in.one_time_code_a11y_label')}
                        label={t('log_in.one_time_code')}
                        value={value}
                        mode="outlined"
                        error={errors.otp?.message}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onSubmitEditing={handleSubmit(handlePress)}
                    />
                )}
            />

            <BodyText variant="sm">{t('log_in.require_otp')}</BodyText>

            <ForgotPasswordButton title={t('log_in.password_form.forgot_password')} onPress={handlePasswordReset} />

            <AuthFooter>
                <PrimaryButton
                    title={t('login_dialog.cta.log_in')}
                    wide
                    onPress={handleSubmit(handlePress)}
                    testID="otp-confirm-login"
                />
            </AuthFooter>

            {isLoading && <LoadingIndicator fullScreen />}
        </ScreenScrollView>
    );
};

const ForgotPasswordButton = styled(LinkButton)`
    margin-top: 40px;
`;

export default EnterOTP;
