import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import styled from 'styled-components';

import Dot, { DotSize } from './Dot';
import colors from '@src/core/colors';

const DOTS = Array.from(Array(3));

type Props = {
    fullScreen?: boolean;
    size?: DotSize;
} & Pick<ViewProps, 'style'>;

const LoadingIndicator: FunctionComponent<Props> = ({ fullScreen, size = 'sm', ...rest }) => {
    return (
        <FullScreenCentered fullScreen={fullScreen} accessibilityLabel="Loading indicator">
            <OuterContainer {...rest}>
                {DOTS.map((_, idx) => (
                    <Dot size={size} key={idx} index={idx} />
                ))}
            </OuterContainer>
        </FullScreenCentered>
    );
};

const FullScreenCentered = styled.View<{ fullScreen: boolean | undefined }>`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    z-index: 9001;
    background-color: ${(props) => (props.fullScreen ? colors.grayTransparent700 : 'transparent')};
`;

const OuterContainer = styled.View`
    flex-direction: row;
    background-color: ${colors.white};
    padding: 18px 20px;
    border-radius: 200px;
    align-self: center;
`;

export default LoadingIndicator;
