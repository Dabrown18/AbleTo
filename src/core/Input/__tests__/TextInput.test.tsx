import { render } from '@testing-library/react-native';
import React from 'react';

import TextInput from '../../Input/TextInput';

test('TextInput snapshot', () => {
    const tree = render(<TextInput label="Type in me!" />).toJSON();

    expect(tree).toMatchSnapshot();
});
