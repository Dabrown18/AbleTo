import React, { ComponentProps, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput as PaperTextInput } from 'react-native-paper';

import TextInput from './TextInput';
import colors from '@src/core/colors';

type TextInputProps = Omit<ComponentProps<typeof TextInput>, 'error' | 'secureTextEntry'>;
export type Props = { label: string; error?: string; hideInput?: boolean; toggleShowPassword?(): void } & Omit<
    TextInputProps,
    'placeholder' | 'label'
>;

const PasswordInput: FunctionComponent<Props> = ({
    label,
    value,
    error,
    toggleShowPassword,
    hideInput = true,
    ...rest
}) => {
    const { t } = useTranslation();

    return (
        <TextInput
            label={label}
            value={value}
            mode="outlined"
            error={error}
            textContentType="password"
            secureTextEntry={hideInput}
            autoCapitalize="none"
            right={
                <PaperTextInput.Icon
                    color={colors.primary600}
                    name={hideInput ? 'eye' : 'eye-off'}
                    accessibilityLabel={t(
                        hideInput ? 'general.buttons.show_password' : 'general.buttons.hide_password'
                    )}
                    onPress={toggleShowPassword}
                />
            }
            {...rest}
        />
    );
};

export default PasswordInput;
