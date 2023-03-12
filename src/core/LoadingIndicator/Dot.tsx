import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';

import useDidMount from '../../hooks/useDidMount';
import colors from '@src/core/colors';

export type DotSize = 'xs' | 'sm' | 'md' | 'lg';

type Props = {
    index: number;
    size: DotSize;
};

const Dot: FunctionComponent<Props> = ({ index, size }) => {
    const progress = useSharedValue(0);

    useDidMount(() => {
        progress.value = withDelay(
            index * 200,
            withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 1000 })), -1)
        );
    });

    const rStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(progress.value, [0, 1], [INACTIVE_COLOR, ACTIVE_COLOR]);

        return { backgroundColor };
    });

    return <StyledDot size={size} style={rStyle} />;
};

const StyledDot = styled(Animated.View)<{ size: DotSize }>`
    width: ${(props) => styles[props.size].width};
    height: ${(props) => styles[props.size].height};
    background-color: ${colors.gray500};
    margin: 0 5px;
    border-radius: 50px;
`;

const ACTIVE_COLOR = colors.gray500;
const INACTIVE_COLOR = colors.gray400;

const styles = StyleSheet.create({
    xs: {
        width: '4px',
        height: '4px',
    },
    sm: {
        width: '8px',
        height: '8px',
    },
    md: {
        width: '16px',
        height: '16px',
    },
    lg: {
        width: '24px',
        height: '24px',
    },
});

export default Dot;
