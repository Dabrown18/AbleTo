import React, { FunctionComponent, ReactNode, useCallback } from 'react';
import { Pressable, ViewProps } from 'react-native';
import Animated, { AnimateProps, Layout, useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';
import styled from 'styled-components';

import { useAccordion } from './AccordionContext';

type Props = {
    icon?: ReactNode;
} & AnimateProps<ViewProps>;

const AccordionButton: FunctionComponent<Props> = ({ icon, children, ...rest }) => {
    const { isExpanded, onToggle } = useAccordion();

    const iconRotation = useDerivedValue(() => withSpring(isExpanded ? 180 : 0, { overshootClamping: true }));
    const rStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${iconRotation.value}deg` }] }));

    const handlePress = useCallback(onToggle, [onToggle]);

    return (
        <Animated.View layout={Layout} {...rest}>
            <StyledPressable accessibilityRole="button" onPress={handlePress}>
                {children}

                {!!icon && <IconContainer style={rStyle}>{icon}</IconContainer>}
            </StyledPressable>
        </Animated.View>
    );
};

const StyledPressable = styled(Pressable)`
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
`;

const IconContainer = styled(Animated.View)`
    align-items: center;
    justify-content: center;
    margin-left: auto;
`;

export default AccordionButton;
