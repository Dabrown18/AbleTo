import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

type Props = {
    value: number;
    maximumValue: number;
    height: number;
    thumbColor: string;
    thumbSize: number;
};

const ProgressBar: FunctionComponent<Props> = ({ value, maximumValue, height, thumbColor, thumbSize, ...rest }) => {
    const foregroundProgressBarWidth = (value / maximumValue) * 100;

    return (
        <BackgroundProgressBar height={height} {...rest}>
            <ForegroundProgressBar height={height} width={foregroundProgressBarWidth}>
                <ProgressBarThumb thumbColor={thumbColor} thumbSize={thumbSize} height={height} />
            </ForegroundProgressBar>
        </BackgroundProgressBar>
    );
};

const BackgroundProgressBar = styled.View<{ height: number }>`
    width: 100%;
    height: ${({ height }) => `${height}px`};
    background-color: ${({ theme }) => theme.colors.gray400};
`;

const ForegroundProgressBar = styled.View<{ width: number; height: number }>`
    width: ${({ width }) => `${width}%`};
    max-width: 100%;
    height: ${({ height }) => `${height}px`};
    background-color: ${({ theme }) => theme.colors.primary400};
`;

const ProgressBarThumb = styled.View<{ thumbColor: string; thumbSize: number; height: number }>`
    position: absolute;
    top: ${({ thumbSize, height }) => `-${(thumbSize - height) / 2}px`};
    right: ${({ thumbSize }) => `-${thumbSize / 2}px`};
    width: ${({ thumbSize }) => `${thumbSize}px`};
    height: ${({ thumbSize }) => `${thumbSize}px`};
    border-radius: ${({ thumbSize }) => `${thumbSize / 2}px`};
    background-color: ${({ theme }) => theme.colors.primary600};
`;

export default ProgressBar;
