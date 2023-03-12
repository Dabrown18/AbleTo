import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AuthFooter from '@src/components/auth/AuthFooter';
import AuthHeader from '@src/components/auth/AuthHeader';
import ScreenScrollView from '@src/components/ScreenScrollView';
import { LinkButton, LoadingIndicator, PasswordInput, PrimaryButton } from '@src/core/';
import useAuth from '@src/hooks/useAuth';
import { AuthStackParamList } from '@src/navigation/AuthStack';
import { selectIsLoading } from '@src/redux/slices/authSlice/selectors';
import { sendPasswordReset } from '@src/services/auth';
import { passwordValidation } from '@src/validators/auth';

type ScreenProps = StackScreenProps<AuthStackParamList, 'EnterPassword'>;
type FormData = {
    password: string;
};

const EnterPassword: FunctionComponent<ScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const isLoading = useSelector(selectIsLoading);
    const [showPassword, setShowPassword] = useState(false);
    const { email } = route.params;

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            password: '',
        },
        mode: 'onBlur',
        shouldFocusError: true,
    });

    const handleLogin = useCallback(
        async ({ password }: FormData) => {
            try {
                await login(email, password);
            } catch (error) {
                if (error.message === 'log_in.require_otp') return navigation.push('EnterOTP', { email, password });

                if (error.message === 'log_in.invalid_email_and_or_password')
                    return setError('password', { message: t(error.message) });

                setError('password', error.message);
            }
        },
        [login, email, navigation, setError, t]
    );

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
                        onSubmitEditing={handleSubmit(handleLogin)}
                        toggleShowPassword={() => setShowPassword((isShowing) => !isShowing)}
                    />
                )}
            />

            <LinkButton title={t('log_in.password_form.forgot_password')} onPress={handlePasswordReset} />

            <AuthFooter>
                <PrimaryButton
                    testID="confirm-login"
                    title={t('login_dialog.cta.log_in')}
                    wide
                    onPress={handleSubmit(handleLogin)}
                />
            </AuthFooter>

            {isLoading && <LoadingIndicator fullScreen />}
        </ScreenScrollView>
    );
};

export default EnterPassword;
