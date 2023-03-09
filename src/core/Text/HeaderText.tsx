import React, { FunctionComponent } from 'react';
import { Text, TextProps } from 'react-native';
import styled from 'styled-components';

import colors from '../colors';
import fonts from '../fonts';
import InterpolatedText from './interpolation/InterpolatedText';

export type HeaderVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type Props = {
    variant?: HeaderVariant;
} & TextProps;

const HeaderText: FunctionComponent<Props> = ({ variant = 'h1', ...rest }) => {
    return <InterpolatedText component={StyledText} componentProps={{ variant, ...rest }} {...rest} />;
};

const StyledText = styled(Text)<{ variant: HeaderVariant }>`
    font-family: ${(props) => styles[props.variant].fontFamily};
    color: ${(props) => styles[props.variant].color};
    font-weight: ${(props) => styles[props.variant].fontWeight};
    font-size: ${(props) => styles[props.variant].fontSize};
    line-height: ${(props) => styles[props.variant].lineHeight};
`;

const styles = {
    h1: {
        fontFamily: fonts.GUARDIAN_EGYP_LIGHT,
        color: colors.gray900,
        fontWeight: '300',
        fontSize: '36px',
        lineHeight: '40px',
    },
    h2: {
        fontFamily: fonts.GUARDIAN_EGYP_LIGHT,
        color: colors.gray900,
        fontWeight: '300',
        fontSize: '30px',
        lineHeight: '39px',
    },
    h3: {
        fontFamily: fonts.GUARDIAN_EGYP_LIGHT,
        color: colors.gray900,
        fontWeight: '300',
        fontSize: '24px',
        lineHeight: '34px',
    },
    h4: {
        fontFamily: fonts.FAKT_PRO_MEDIUM,
        color: colors.gray800,
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '24px',
    },
    h5: {
        fontFamily: fonts.FAKT_PRO_MEDIUM,
        color: colors.gray800,
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '21px',
    },
    h6: {
        fontFamily: fonts.FAKT_PRO_MEDIUM,
        color: colors.gray800,
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',
    },
};

export default HeaderText;
