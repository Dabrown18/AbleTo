import React, { FunctionComponent } from 'react';
import { View, ViewProps } from 'react-native';
import styled from 'styled-components';

import useScreenReader from '@src/hooks/useScreenReader';

/**
 * A component that hides any of its children visually.
 * They will not be present on the screen, but will be accessible to Screen Reader technology.
 * Does not render any children, if a screen reader is not currently enabled.
 **/
const VisuallyHidden: FunctionComponent<ViewProps> = ({ ...rest }) => {
    const screenReaderEnabled = useScreenReader();

    if (!screenReaderEnabled) {return null;}

    return <Hidden {...rest} />;
};

const Hidden = styled(View)`
    position: absolute;
    clip: rect(0 0 0 0);
    overflow: hidden;
    height: 1px;
    width: 1px;
    bottom: 0;
`;

export default VisuallyHidden;
