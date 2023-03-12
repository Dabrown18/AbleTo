import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import styled from 'styled-components';

import BodyText from '../Text/BodyText';

type TooltipPosition = 'top' | 'bottom';

type Props = {
    text: string;
    position: TooltipPosition;
} & ViewProps;

const Tooltip: FunctionComponent<Props> = ({ text, position, ...rest }) => {
    return (
        <Container layout={Layout} entering={FadeIn.delay(300)} exiting={FadeOut.duration(300)} {...rest}>
            {position === 'bottom' && <Triangle />}
            <Text variant="sm">{text}</Text>

            {position === 'top' && <Triangle style={{ transform: [{ rotate: '180deg' }] }} />}
        </Container>
    );
};

const Container = styled(Animated.View)`
    justify-content: center;
    align-items: center;

    margin-bottom: 10px;
`;

const Triangle = styled.View`
    background-color: transparent;
    left: -4px;

    border-style: solid;
    border-left-width: 8px;
    border-right-width: 8px;
    border-bottom-width: 8px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: ${({ theme }) => theme.colors.gray800};
`;

const Text = styled(BodyText)`
    color: #fff;

    padding: 8px;
    background-color: ${({ theme }) => theme.colors.gray800};
    border-radius: 4px;
`;

export default Tooltip;
