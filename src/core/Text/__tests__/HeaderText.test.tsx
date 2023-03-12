import React from 'react';

import HeaderText from '../HeaderText';
import { renderWithTheme } from '@src/utils/testing';

describe('HeaderText snapshots', () => {
    test('Header 1', () => {
        const tree = renderWithTheme(<HeaderText variant={'h1'} children="Hello there!" />);

        expect(tree).toMatchSnapshot();
    });

    test('Header 2', () => {
        const tree = renderWithTheme(<HeaderText variant={'h2'} children="Hello there!" />);

        expect(tree).toMatchSnapshot();
    });

    test('Header 3', () => {
        const tree = renderWithTheme(<HeaderText variant={'h3'} children="Hello there!" />);

        expect(tree).toMatchSnapshot();
    });

    test('Header 4', () => {
        const tree = renderWithTheme(<HeaderText variant={'h4'} children="Hello there!" />);

        expect(tree).toMatchSnapshot();
    });

    test('Header 5', () => {
        const tree = renderWithTheme(<HeaderText variant={'h5'} children="Hello there!" />);

        expect(tree).toMatchSnapshot();
    });

    test('Header 6', () => {
        const tree = renderWithTheme(<HeaderText variant={'h6'} children="Hello there!" />);

        expect(tree).toMatchSnapshot();
    });
});
