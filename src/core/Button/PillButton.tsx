import React, { FunctionComponent, ReactNode } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import styled from 'styled-components/native';

import BodyText from '../Text/BodyText';

type Props = {
    title?: string;
    icon?: ReactNode;
    selected: boolean;
    onPress(): void;
} & PressableProps;

const PillButton: FunctionComponent<Props> = ({ title, icon, children, selected, onPress, ...rest }) => {
    return (
        <Animated.View
            layout={Layout}
            entering={FadeIn.duration(200).springify()}
            exiting={FadeOut.duration(200).springify()}
        >
            <StyledPill
                accessibilityState={{ selected }}
                accessibilityRole="button"
                selected={selected}
                onPress={onPress}
                {...rest}
            >
                <ButtonText variant="sm" accessible={false} selected={selected}>
                    {title || children}
                </ButtonText>
                {icon && <IconContainer>{icon}</IconContainer>}
            </StyledPill>
        </Animated.View>
    );
};

const StyledPill = styled(Pressable)<{ selected: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    background-color: ${({ selected, theme }) => (selected ? theme.colors.primary600 : theme.colors.gray50)};
    padding: 6px 16px;
    margin: 8px 8px 8px 0;
    width: auto;
`;

const ButtonText = styled(BodyText)<{ selected: boolean }>`
    flex-shrink: 1;
    color: ${({ selected, theme }) => (selected ? theme.colors.white : theme.colors.black)};
`;

const IconContainer = styled(View)`
    margin-left: 10px;
`;

export default PillButton;
