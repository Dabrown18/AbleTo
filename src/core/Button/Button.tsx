import React, { FunctionComponent } from 'react';
import { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { HeaderVariant } from '../Text/HeaderText';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import TertiaryButton from './TertiaryButton';

type Props = {
    title: string;
    rightIcon?: string;
    leftIcon?: string;
    wide?: boolean;
    textVariant?: HeaderVariant;
    textStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    variant?: 'primary' | 'secondary' | 'tertiary';
} & Omit<PressableProps, 'style'>;

const Button: FunctionComponent<Props> = ({
    title,
    leftIcon,
    rightIcon,
    wide,
    variant = 'primary',
    textVariant = 'h4',
    textStyle,
    ...rest
}) => {
    switch (variant) {
        case 'primary':
            return (
                <PrimaryButton
                    title={title}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    wide={wide}
                    textVariant={textVariant}
                    textStyle={textStyle}
                    {...rest}
                />
            );

        case 'secondary':
            return (
                <SecondaryButton
                    title={title}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    wide={wide}
                    textVariant={textVariant}
                    textStyle={textStyle}
                    {...rest}
                />
            );

        case 'tertiary':
            return (
                <TertiaryButton
                    title={title}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    wide={wide}
                    textVariant={textVariant}
                    textStyle={textStyle}
                    {...rest}
                />
            );
    }
};

export default Button;
