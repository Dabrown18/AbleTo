import React, { FunctionComponent, useState } from 'react';
import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import styled from 'styled-components';

import { HeaderVariant } from '../Text/HeaderText';
import BaseButton, { StyledBaseButtonProps } from './BaseButton';
import colors from '@src/core/colors';

export type Props = {
    title: string;
    leftIcon?: string;
    rightIcon?: string;
    wide?: boolean;
    textVariant?: HeaderVariant;
    textStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, 'style'>;

const PrimaryButton: FunctionComponent<Props> = ({
    title,
    leftIcon,
    rightIcon,
    wide = false,
    textVariant,
    textStyle,
    style,
    disabled,
    ...rest
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const elevation = isPressed ? 5 : 0;
    const textColor = disabled ? colors.gray400 : colors.white;

    return (
        <Pressable
            disabled={disabled}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            {...rest}
        >
            <StyledBaseButton
                title={title}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                textVariant={textVariant}
                textStyle={[textStyle, { color: textColor }]}
                wide={wide}
                style={[{ elevation }, style]}
                disabled={!!disabled}
            />
        </Pressable>
    );
};

const StyledBaseButton = styled(BaseButton)<StyledBaseButtonProps>`
    background-color: ${({ disabled, theme }) => (disabled ? theme.colors.gray100 : theme.colors.primary600)};
    border-color: ${({ disabled, theme }) => (disabled ? theme.colors.gray200 : theme.colors.primary600)};
`;

export default PrimaryButton;
