import React, { FunctionComponent } from 'react';
import { Text, TextProps } from 'react-native';
import styled from 'styled-components/native';

import colors from '../colors';
import fonts from '../fonts';
import InterpolatedText from './interpolation/InterpolatedText';

export type BodyVariant = 'regular' | 'sm' | 'xs';

type Props = {
    variant?: BodyVariant;
} & TextProps;

const BodyText: FunctionComponent<Props> = ({ variant = 'regular', ...rest }) => {
    return <InterpolatedText component={StyledText} componentProps={{ variant, ...rest }} {...rest} />;
};

const StyledText = styled(Text)<{ variant: BodyVariant }>`
    font-family: ${(props) => styles[props.variant].fontFamily};
    color: ${(props) => styles[props.variant].color};
    font-weight: ${(props) => styles[props.variant].fontWeight};
    font-size: ${(props) => styles[props.variant].fontSize};
    line-height: ${(props) => styles[props.variant].lineHeight};
`;

const styles = {
    regular: {
        fontFamily: fonts.FAKT_PRO_NORMAL,
        color: colors.gray800,
        fontWeight: '400',
        fontSize: '16px',
        lineHeight: '24px',
    },
    sm: {
        fontFamily: fonts.FAKT_PRO_NORMAL,
        color: colors.gray800,
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '21px',
    },
    xs: {
        fontFamily: fonts.FAKT_PRO_NORMAL,
        color: colors.gray800,
        fontWeight: '400',
        fontSize: '12px',
        lineHeight: '16px',
    },
};

export default BodyText;
