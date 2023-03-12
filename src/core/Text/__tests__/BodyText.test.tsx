import React from 'react';

import BodyText, { BodyVariant } from '../BodyText';
import { renderWithTheme } from '@src/utils/testing';

describe('BodyText snapshots', () => {
    const renderText = (variant: BodyVariant) =>
        renderWithTheme(<BodyText variant={variant} children="Hello there!" />);

    test('Body 1', () => {
        const tree = renderText('regular');

        expect(tree).toMatchSnapshot();
    });

    test('Body 2', () => {
        const tree = renderText('sm');

        expect(tree).toMatchSnapshot();
    });

    test('Body 3', () => {
        const tree = renderText('xs');

        expect(tree).toMatchSnapshot();
    });
});
