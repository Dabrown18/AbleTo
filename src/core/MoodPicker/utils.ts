import { TAU } from 'react-native-redash';

import colors from '../colors';

export const PICKER_SIZE = 220;
export const STROKE = 20;
export const KNOB_SIZE = 30;
export const BORDER_SIZE = 6;
export const R = (PICKER_SIZE - STROKE) / 2;
export const CENTER = { x: R, y: R };
const BUFFER = 0.17;

export type MoodRating = typeof MOOD_RATINGS[0];

export const normalize = (value: number) => {
    'worklet';

    const mod = value % TAU;
    return mod < 0 ? TAU + mod : mod;
};

export const MOOD_RATINGS = [
    { color: colors.teal300, valueInt: 7 },
    { color: '#B3CFBC', valueInt: 6 },
    { color: '#C8D3B3', valueInt: 5 },
    { color: colors.yellow200, valueInt: 4 },
    { color: '#F4C491', valueInt: 3 },
    { color: '#F2B487', valueInt: 2 },
    { color: colors.orange300, valueInt: 1 },
];

export const getCurrentMood = (rad: number) => {
    'worklet';

    // Adds 10 degrees (or 0.17 radians)
    // to offset the size of the rotator knob
    const radian = rad + BUFFER;

    if (radian >= 0 && radian < 0.89) {
        return MOOD_RATINGS[1];
    } else if (radian >= 0.89 && radian < 1.79) {
        return MOOD_RATINGS[0];
    } else if (radian >= 1.79 && radian < 2.69) {
        return MOOD_RATINGS[6];
    } else if (radian >= 2.69 && radian < 3.58) {
        return MOOD_RATINGS[5];
    } else if (radian >= 3.58 && radian < 4.48) {
        return MOOD_RATINGS[4];
    } else if (radian >= 4.48 && radian < 5.38) {
        return MOOD_RATINGS[3];
    } else {
        return MOOD_RATINGS[2];
    }
};

export const getRadianForCurrentMood = (moodValue: number) => {
    'worklet';
    switch (moodValue) {
        case 7:
            return 0.89 + BUFFER;
        case 6:
            return 0 + BUFFER;
        case 5:
            return 5.4 + BUFFER;
        case 4:
            return 4.48 + BUFFER;
        case 3:
            return 3.58 + BUFFER;
        case 2:
            return 2.69 + BUFFER;
        case 1:
            return 1.79 + BUFFER;
        default:
            return 0 + BUFFER;
    }
};

// Removes 1/Nth of TAU (the full circle rotation) from the current radian
// Where N is the number of mood ratings we have
export const getNextMood = (rad: number) => normalize(rad - TAU / MOOD_RATINGS.length);
