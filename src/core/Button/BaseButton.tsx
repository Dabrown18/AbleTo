import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';
import styled from 'styled-components';

import colors from '../colors';
import Icon from '../Icon/Icon';
import HeaderText, { HeaderVariant } from '../Text/HeaderText';

type Props = {
    title: string;
    leftIcon?: string;
    rightIcon?: string;
    iconColor?: string;
    wide?: boolean;
    textVariant?: HeaderVariant;
    textStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    rightIconProps?: SvgProps;
    disabled?: boolean;
};

export type StyledBaseButtonProps = Omit<Props, 'textStyle'>;

const BaseButton: FunctionComponent<Props> = ({
    title,
    leftIcon,
    rightIcon,
    rightIconProps,
    iconColor,
    wide = false,
    textVariant = 'h4',
    textStyle,
    style,
    disabled,
}) => {
    return (
        <Button
            wide={wide}
            accessibilityState={{ disabled }}
            accessibilityLabel={title}
            accessibilityRole="button"
            style={style}
        >
            {leftIcon && <LeftIcon icon={leftIcon} color={disabled ? colors.gray400 : iconColor} />}

            <Text variant={textVariant} style={textStyle} importantForAccessibility="no-hide-descendants">
                {title}
            </Text>

            {rightIcon && (
                <RightIcon icon={rightIcon} color={disabled ? colors.gray400 : iconColor} {...rightIconProps} />
            )}
        </Button>
    );
};

const Button = styled(Animated.View)<{ wide: boolean }>`
    display: flex;
    flex-direction: row;
    padding: 12px 24px;
    border-radius: 100px;
    border-width: 1.5px;
    justify-content: center;
    align-items: center;
    align-self: center;
    min-width: ${({ wide }) => (wide ? '100%' : 'auto')};
`;

const Text = styled(HeaderText)`
    flex-shrink: 1;
`;

const LeftIcon = styled(Icon)`
    margin-right: 10px;
`;

const RightIcon = styled(Icon)`
    margin-left: 10px;
`;

export default BaseButton;
