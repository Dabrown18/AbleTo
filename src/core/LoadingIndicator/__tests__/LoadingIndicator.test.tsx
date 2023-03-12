import { render } from '@testing-library/react-native';
import React from 'react';

import LoadingIndicator from '../LoadingIndicator';

describe('LoadingIndicator snapshot', () => {
    test('Normal state', () => {
        const tree = render(<LoadingIndicator />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Centered state', () => {
        const tree = render(<LoadingIndicator />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('FullScreen state', () => {
        const tree = render(<LoadingIndicator fullScreen />).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
