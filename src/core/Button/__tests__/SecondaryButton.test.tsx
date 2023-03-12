import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import SecondaryButton, { Props } from '../../Button/SecondaryButton';
import { renderWithTheme } from '@src/utils/testing';

const title = 'Click me!';

const renderButton = (props: Props) => renderWithTheme(<SecondaryButton {...props} />);

describe('PrimaryButton Snapshots', () => {
    test('Normal state', () => {
        const tree = renderButton({ title }).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Wide variant', () => {
        const tree = renderButton({ title, wide: true }).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Disabled state', () => {
        const tree = renderButton({ title, disabled: true }).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

describe('PrimaryButton behaviour', () => {
    it('Handles onClick', async () => {
        const onPress = jest.fn();

        const { getByText } = renderButton({ title, onPress });

        const button = getByText(title);

        fireEvent.press(button);

        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
