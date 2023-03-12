import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';

import LabelText, { LabelVariant } from '../LabelText';
import colors from '@src/core/colors';
import fonts from '@src/core/fonts';

describe('BodyText snapshots', () => {
    const theme = {
        colors,
        fonts,
    };

    const renderText = (variant: LabelVariant) =>
        render(
            <ThemeProvider theme={theme}>
                <LabelText variant={variant} children="Hello there!" />
            </ThemeProvider>
        );

    test('Label 1', () => {
        const tree = renderText('l1');

        expect(tree).toMatchSnapshot();
    });

    test('Label 2', () => {
        const tree = renderText('l2');

        expect(tree).toMatchSnapshot();
    });
});
