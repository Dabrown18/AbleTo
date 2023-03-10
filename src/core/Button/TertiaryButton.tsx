import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';
import styled from 'styled-components';

import { HeaderVariant } from '../Text/HeaderText';
import BaseButton, { StyledBaseButtonProps } from './BaseButton';
import colors from '@src/core/colors';

export type Props = {
    title: string;
    leftIcon?: string;
    rightIcon?: string;
    iconColor?: string;
    wide?: boolean;
    textVariant?: HeaderVariant;
    textStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    rightIconProps?: SvgProps;
} & Omit<PressableProps, 'style'>;

const TertiaryButton: FunctionComponent<Props> = ({
    title,
    leftIcon,
    rightIcon,
    rightIconProps,
    wide = false,
    textVariant,
    textStyle,
    style,
    disabled,
    ...rest
}) => {
    const progress = useSharedValue(0);
    const onPressIn = useCallback(() => (progress.value = customTimingFunction(1)), [progress]);
    const onPressOut = useCallback(() => (progress.value = customTimingFunction(0)), [progress]);

    const customTimingFunction = (toValue: number) => {
        return withTiming(toValue, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    };

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            [colors.primaryTransparent50, colors.primary50]
        );

        return { backgroundColor };
    });

    const textColor = disabled ? colors.gray400 : colors.primary600;
    const iconColor = disabled ? colors.gray400 : colors.primary600;

    return (
        <Pressable
            accessibilityState={{ disabled: !!disabled }}
            disabled={disabled}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            {...rest}
        >
            <StyledBaseButton
                title={title}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                rightIconProps={rightIconProps}
                iconColor={iconColor}
                textVariant={textVariant}
                textStyle={[textStyle, { color: textColor }]}
                wide={wide}
                style={[style, { ...animatedStyle }]}
                disabled={!!disabled}
            />
        </Pressable>
    );
};

const StyledBaseButton = styled(BaseButton)<StyledBaseButtonProps>`
    background-color: ${colors.primaryTransparent50};
    border-color: transparent;
`;

export default TertiaryButton;
