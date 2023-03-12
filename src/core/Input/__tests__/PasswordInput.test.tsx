import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import PasswordInput, { Props } from '../PasswordInput';

const defaultProps: Props = { label: 'Type your secrets in me!' };

const renderInput = (props: Props = defaultProps) => render(<PasswordInput {...props} />);

describe('PasswordInput snapshots', () => {
    test('Normal state', () => {
        const tree = renderInput().toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Error state', () => {
        const tree = renderInput({ ...defaultProps, error: 'Not good!' }).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Hidden state', () => {
        const tree = renderInput({ ...defaultProps, hideInput: true }).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

describe('PasswordInput behaviour', () => {
    const text = 'password!';

    it('Handles user input', async () => {
        const onChangeText = jest.fn();
        const { getByLabelText } = renderInput({ ...defaultProps, onChangeText });

        const input = getByLabelText(defaultProps.label);
        fireEvent.changeText(input, text);

        expect(onChangeText).toHaveBeenCalled();
    });

    it('Calls password visibility toggle', async () => {
        const toggleShowPassword = jest.fn();

        const { getByLabelText } = renderInput({ ...defaultProps, toggleShowPassword });

        const visibilityToggle = getByLabelText('general.buttons.show_password');

        fireEvent.press(visibilityToggle);
        fireEvent.press(visibilityToggle);
        fireEvent.press(visibilityToggle);

        expect(toggleShowPassword).toHaveBeenCalledTimes(3);
    });

    it('Shows password input when visibility is on', async () => {
        const { getByLabelText, getByDisplayValue } = renderInput({ ...defaultProps, hideInput: false });

        const input = getByLabelText(defaultProps.label);
        fireEvent.changeText(input, text);

        const inputText = getByDisplayValue(text);
        expect(inputText).toBeTruthy();
    });

    it('Does not show password input when visibility is off', async () => {
        const { getByLabelText, queryByText } = renderInput({ ...defaultProps });

        const input = getByLabelText(defaultProps.label);
        fireEvent.changeText(input, text);

        const inputText = queryByText(text);
        expect(inputText).toBeFalsy();
    });
});
