import React, { FunctionComponent } from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

import colors from '@src/core/colors';
import HeaderText from '@src/core/Text/HeaderText';

type Props = {
    title: string;
} & Omit<PressableProps, 'style'>;

const SignUpThroughButton: FunctionComponent<Props> = ({ title, ...rest }) => {
    return (
        // We are using StyleSheet because styled components
        // doesn't support the elevation property
        <Pressable style={({ pressed: isPressed }) => [styles.button, { elevation: isPressed ? 5 : 3 }]} {...rest}>
            <HeaderText variant="h4">{title}</HeaderText>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        marginBottom: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        textAlign: 'center',
        borderRadius: 4,
        borderColor: colors.gray400,
        borderWidth: 0.2,
        alignSelf: 'center',
    },
});

export default SignUpThroughButton;
