import React, { FunctionComponent, Suspense } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import Icons, { Icon as IconType } from './icons';
import Logger from '@src/services/logger';

type Props = {
    icon: string;
    size?: number;
} & SvgProps;

const Icon: FunctionComponent<Props> = ({ icon, size, ...rest }) => {
    const LazyLoadedIcon = Icons[icon as IconType];

    if (!LazyLoadedIcon) {
        Logger.message(`${icon} icon does not exist`);
        return null;
    }

    return (
        <Suspense fallback={<LoadingIndicator />}>
            <View testID="Icon">
                {size ? <LazyLoadedIcon {...rest} width={size} height={size} /> : <LazyLoadedIcon {...rest} />}
            </View>
        </Suspense>
    );
};

export default Icon;
