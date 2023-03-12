import React, { FunctionComponent, useCallback } from 'react';
import { View, ViewProps } from 'react-native';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Defs, LinearGradient, Stop, Svg } from 'react-native-svg';
import styled from 'styled-components';

import PrimaryButton from '../Button/PrimaryButton';
import BodyText from '../Text/BodyText';
import VisuallyHidden from '../VisuallyHidden';
import Knob from './Knob';
import Palette from './Palette';
import { getCurrentMood, getNextMood, getRadianForCurrentMood, MOOD_RATINGS, MoodRating, PICKER_SIZE } from './utils';
import { PredifinedMoodEntry } from '@src/activities/templates/EnterMood/types';
import useTranslation from '@src/hooks/useTranslation';

type Props = {
    moodSelection?: PredifinedMoodEntry;
    onMoodChanged(moodValue: number): void;
    /** Triggered after an animation (touch or pan) ends */
    onSelectionEnd?(moodValue: number): void;
} & ViewProps;

const MoodPicker: FunctionComponent<Props> = ({ moodSelection, onMoodChanged, onSelectionEnd, ...rest }) => {
    const { t } = useTranslation('templates.able_to_enter_mood');
    // Start off from the circle's top
    // which is half PI in radians
    const angle = useSharedValue(moodSelection ? getRadianForCurrentMood(moodSelection.value) : Math.PI / 2);
    const mood = useSharedValue<MoodRating | undefined>(undefined);

    const moodColor = useDerivedValue(() => mood.value?.color);

    const handleMoodChange = useCallback(
        (angleValue: number) => {
            'worklet';

            const newMood = getCurrentMood(angleValue);
            mood.value = newMood;
            runOnJS(onMoodChanged)(newMood.valueInt);
        },
        [mood, onMoodChanged]
    );

    const handleSelectionEnd = useCallback(
        (angleValue: number) => {
            'worklet';

            if (!onSelectionEnd) {return;}

            runOnJS(onSelectionEnd)(angleValue);
        },
        [onSelectionEnd]
    );

    const handleAccessibilityCycle = useCallback(() => {
        angle.value = getNextMood(angle.value);

        handleMoodChange(angle.value);
        handleSelectionEnd(angle.value);
    }, [angle, handleMoodChange, handleSelectionEnd]);

    return (
        <Container {...rest}>
            <Svg width={PICKER_SIZE} height={PICKER_SIZE} viewBox="-10 -10 220 220">
                <Defs>
                    <LinearGradient id="prefix__a" gradientUnits="objectBoundingBox" x1={0} y1={0} x2={1} y2={1}>
                        <Stop offset="70%" stopColor={MOOD_RATINGS[0].color} />
                        <Stop offset="100%" stopColor={MOOD_RATINGS[1].color} />
                    </LinearGradient>
                    <LinearGradient id="prefix__b" gradientUnits="objectBoundingBox" x1={0} y1={0} x2={0} y2={1}>
                        <Stop offset="0%" stopColor={MOOD_RATINGS[1].color} />
                        <Stop offset="100%" stopColor={MOOD_RATINGS[2].color} />
                    </LinearGradient>
                    <LinearGradient id="prefix__c" gradientUnits="objectBoundingBox" x1={1} y1={0} x2={0} y2={1}>
                        <Stop offset="13%" stopColor={MOOD_RATINGS[2].color} />
                        <Stop offset="90%" stopColor={MOOD_RATINGS[3].color} />
                    </LinearGradient>
                    <LinearGradient id="prefix__d" gradientUnits="objectBoundingBox" x1={1} y1={1} x2={1} y2={0}>
                        <Stop offset="0%" stopColor={MOOD_RATINGS[3].color} />
                        <Stop offset="100%" stopColor={MOOD_RATINGS[5].color} />
                    </LinearGradient>
                    <LinearGradient id="prefix__e" gradientUnits="objectBoundingBox" x1={0} y1={1} x2={0} y2={0}>
                        <Stop offset="0%" stopColor={MOOD_RATINGS[5].color} />
                    </LinearGradient>
                    <LinearGradient id="prefix__f" gradientUnits="objectBoundingBox" x1={0} y1={1} x2={1} y2={0}>
                        <Stop offset="0%" stopColor={MOOD_RATINGS[5].color} />
                        <Stop offset="100%" stopColor={MOOD_RATINGS[6].color} />
                    </LinearGradient>
                </Defs>

                <Palette handleMoodChange={handleMoodChange} onSelectionEnd={handleSelectionEnd} angle={angle} />

                <Knob
                    moodColor={moodColor}
                    handleMoodChange={handleMoodChange}
                    onSelectionEnd={handleSelectionEnd}
                    angle={angle}
                />
            </Svg>

            {!!moodSelection && (
                <MoodLabel
                    accessibilityLiveRegion="polite"
                    accessibilityLabel={t('mood_accessibility_label', { mood: moodSelection.description })}
                >
                    {moodSelection.description}
                </MoodLabel>
            )}
            <VisuallyHidden>
                <PrimaryButton title={t('picker_button_accessibility_label')} onPress={handleAccessibilityCycle} />
            </VisuallyHidden>
        </Container>
    );
};

const MoodLabel = styled(BodyText)`
    position: absolute;
    font-size: 24px;
    line-height: 27px;
    color: ${({ theme }) => theme.colors.gray900};
`;

const Container = styled(View)`
    position: relative;

    align-items: center;
    justify-content: center;
`;

export default MoodPicker;
