import React, { ComponentProps, FunctionComponent, useState } from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TextInput as TextInputBase } from 'react-native-paper';

import colors from '@src/core/colors';

// Copying over the props from TextInput for now, until we create our own version
// interface will most likely match, so no need to type these out now
// (I'm also lazy)
type TextInputProps = Omit<ComponentProps<typeof TextInputBase>, 'error'>;
type Props = { label: string; error?: string } & Omit<TextInputProps, 'placeholder' | 'label'>;

const TextInput: FunctionComponent<Props> = ({ style, label, error, onFocus, onBlur, ...rest }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <>
            <TextInputBase
                onFocus={(e) => {
                    setIsFocused(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    onBlur?.(e);
                }}
                outlineColor={colors.gray200}
                activeOutlineColor={colors.primary600}
                accessibilityLabel={label}
                label={label}
                error={!!error}
                // Hide the placeholder when the input is focused
                placeholder={isFocused ? undefined : label}
                theme={{ colors: { text: colors.black, placeholder: colors.gray800 } }}
                style={[style, styles.input]}
                dense
                {...rest}
            />

            <HelperText type="error" visible={!!error} accessibilityLiveRegion="assertive">
                {error}
            </HelperText>
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.white,
    },
});

export default TextInput;
