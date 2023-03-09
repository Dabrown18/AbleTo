import React, { FunctionComponent } from 'react';
import { Text, TextProps } from 'react-native';
import styled from 'styled-components/native';

import colors from '../colors';
import fonts from '../fonts';
import InterpolatedText from './interpolation/InterpolatedText';

export type LabelVariant = 'l1' | 'l2';

type Props = {
    variant?: LabelVariant;
} & TextProps;

const LabelText: FunctionComponent<Props> = ({ variant = 'l1', ...rest }) => {
    return <InterpolatedText component={StyledText} componentProps={{ variant, ...rest }} {...rest} />;
};

const StyledText = styled(Text)<{ variant: LabelVariant }>`
    font-family: ${(props) => styles[props.variant].fontFamily};
    color: ${(props) => styles[props.variant].color};
    font-weight: ${(props) => styles[props.variant].fontWeight};
    font-size: ${(props) => styles[props.variant].fontSize};
    line-height: ${(props) => styles[props.variant].lineHeight};
    letter-spacing: ${(props) => styles[props.variant].letterSpacing};
`;

const styles = {
    l1: {
        fontFamily: fonts.FAKT_PRO_MEDIUM,
        color: colors.gray800,
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
    },
    l2: {
        fontFamily: fonts.FAKT_PRO_MEDIUM,
        color: colors.gray800,
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '21px',
        letterSpacing: '0.5px',
    },
};

export default LabelText;
