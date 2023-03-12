import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import colors from '../colors';

type Props = {
    size: number;
    progress: number;
    tintColor: string;
};

const CircularProgressBar: FunctionComponent<Props> = ({ children, size, progress, tintColor }) => {
    const borderWidth = size / 15;

    // @todo: This can be rewritten to use only SVGs instead of a third party package.
    return (
        <AnimatedCircularProgress
            size={size}
            width={borderWidth}
            prefill={progress}
            fill={progress}
            tintColor={tintColor}
            backgroundColor={colors.gray200}
            rotation={0}
            duration={200}
        >
            {() => <View>{children}</View>}
        </AnimatedCircularProgress>
    );
};

export default CircularProgressBar;
