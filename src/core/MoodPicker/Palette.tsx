import React, { FunctionComponent } from 'react';
import { Animated } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';
import { canvas2Polar } from 'react-native-redash';
import { G, Path } from 'react-native-svg';

import { CENTER, normalize, STROKE } from './utils';

type Props = {
    angle: SharedValue<number>;
    handleMoodChange(moodValue: number): void;
    onSelectionEnd(moodValue: number): void;
};

const AnimatedCircularPicker = Animated.createAnimatedComponent(G);

const Palette: FunctionComponent<Props> = ({ angle, handleMoodChange, onSelectionEnd }) => {
    const tapGesture = Gesture.Tap()
        .onStart(({ x, y }) => {
            const { theta } = canvas2Polar({ x, y }, CENTER);
            angle.value = normalize(theta);

            handleMoodChange(angle.value);
        })
        .onEnd(() => onSelectionEnd(angle.value))
        .hitSlop(16);

    return (
        <GestureDetector gesture={tapGesture}>
            <AnimatedCircularPicker fill="none" strokeWidth={STROKE}>
                <Path d="M0-100a100 100 0 0186.6 50" stroke="url(#prefix__a)" transform="translate(100 100)" />
                <Path d="M86.6-50a100 100 0 010 100" stroke="url(#prefix__b)" transform="translate(100 100)" />
                <Path d="M86.6 50A100 100 0 010 100" stroke="url(#prefix__c)" transform="translate(100 100)" />
                <Path d="M0 100a100 100 0 01-86.6-50" stroke="url(#prefix__d)" transform="translate(100 100)" />
                <Path d="M-86.6 50a100 100 0 010-100" stroke="url(#prefix__e)" transform="translate(100 100)" />
                <Path d="M-86.6-50A100 100 0 010-100" stroke="url(#prefix__f)" transform="translate(100 100)" />
            </AnimatedCircularPicker>
        </GestureDetector>
    );
};

export default Palette;
