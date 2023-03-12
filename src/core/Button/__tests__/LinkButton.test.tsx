import React from 'react';

import LinkButton from '../LinkButton';
import { renderWithTheme } from '@src/utils/testing';

test('LinkButton snapshot', () => {
    const tree = renderWithTheme(<LinkButton title="Click me!" />).toJSON();

    expect(tree).toMatchSnapshot();
});
