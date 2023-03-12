import React, { FunctionComponent } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { canvas2Polar, polar2Canvas } from 'react-native-redash';
import styled from 'styled-components';

import colors from '../colors';
import { BORDER_SIZE, CENTER, KNOB_SIZE, normalize, R, STROKE } from './utils';

type Props = {
    angle: SharedValue<number>;
    moodColor: SharedValue<string | undefined>;
    handleMoodChange(moodValue: number): void;
    onSelectionEnd(moodValue: number): void;
};

const Knob: FunctionComponent<Props> = ({ moodColor, angle, handleMoodChange, onSelectionEnd }) => {
    // This keeps the offset from our previous rotation gesture
    // so we start off at the right point. Otherwise the knob would jump
    // at the beginning of our drag gesture
    const offset = useSharedValue(0);

    const position = useDerivedValue(() => polar2Canvas({ theta: angle.value, radius: R }, CENTER));

    const rStyle = useAnimatedStyle(() => {
        const { x, y } = position.value;

        const backgroundColor = moodColor.value ? moodColor.value : colors.cream300;

        return {
            transform: [{ translateX: x + BORDER_SIZE - STROKE / 2 }, { translateY: y + BORDER_SIZE - STROKE / 2 }],
            backgroundColor: backgroundColor,
        };
    });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            // Makes the initial offset be the current angle
            // So we start dragging from the right spot
            offset.value = angle.value;
        })
        .onChange(({ x, y }) => {
            const { theta } = canvas2Polar({ x, y }, CENTER);
            const delta = theta - offset.value;
            angle.value = normalize(angle.value + delta);
            offset.value = theta;

            handleMoodChange(angle.value);
        })
        .onEnd(() => onSelectionEnd(angle.value))
        .hitSlop(16);

    return (
        <GestureDetector gesture={panGesture}>
            <AnimatedContainer>
                <AnimatedKnob style={rStyle} />
            </AnimatedContainer>
        </GestureDetector>
    );
};

export default Knob;

const FULL_KNOB_SIZE = KNOB_SIZE + BORDER_SIZE;

const AnimatedKnob = styled(Animated.View)`
    position: absolute;
    top: -${BORDER_SIZE}px;
    left: -${BORDER_SIZE}px;

    width: ${FULL_KNOB_SIZE}px;
    height: ${FULL_KNOB_SIZE}px;

    flex: 1;
    justify-content: center;
    align-items: center;

    elevation: 6;

    border: 6px solid #fff;
    border-radius: ${FULL_KNOB_SIZE / 2}px;
`;

const AnimatedContainer = styled(Animated.View)`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`;
