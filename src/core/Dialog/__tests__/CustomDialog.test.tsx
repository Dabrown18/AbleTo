import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import PrimaryButton from '../../Button/PrimaryButton';
import BodyText from '../../Text/BodyText';
import HeaderText from '../../Text/HeaderText';
import CustomDialog from '../CustomDialog';
import { renderWithTheme } from '@src/utils/testing';

const titleJsx = <HeaderText variant="h3">Title</HeaderText>;
const bodyJsx = <BodyText>Body</BodyText>;
const onActionClick = jest.fn();
const onDismiss = jest.fn();
const actionButtonTitle = 'Action Button Title';
const actionsJsx = (
    <View>
        <PrimaryButton wide title={actionButtonTitle} onPress={onActionClick} />
    </View>
);
const dismissable = false;
const customDialog = (
    <CustomDialog titleContent={titleJsx} bodyContent={bodyJsx} actionsContent={actionsJsx} onDismiss={onDismiss} />
);

describe('CustomDialog Snapshots', () => {
    test('Dismissable', () => {
        const tree = renderWithTheme(customDialog).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Not Dismissable', () => {
        const tree = renderWithTheme(
            <CustomDialog
                titleContent={titleJsx}
                bodyContent={bodyJsx}
                actionsContent={actionsJsx}
                dismissable={dismissable}
                onDismiss={onDismiss}
            />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Custom Dialog Behaviour', () => {
    it('Handles Action Button onClick', async () => {
        const { findByText } = renderWithTheme(customDialog);

        const button = await findByText(actionButtonTitle);

        fireEvent.press(button);

        expect(onActionClick).toHaveBeenCalledTimes(1);
    });
});
