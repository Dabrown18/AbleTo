import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import ConfirmationDialog from '../ConfirmationDialog';
import { renderWithTheme } from '@src/utils/testing';

const confirmationDialogTitle = 'Title';
const confirmationDialogBody = 'Body';
const confirmButtonMessage = 'Yes';
const declineButtonMessage = 'No';
const dismissable = false;
const onPrimaryAction = jest.fn();
const onSecondaryAction = jest.fn();
const onDismiss = jest.fn();
const dialog = (
    <ConfirmationDialog
        title={confirmationDialogTitle}
        body={confirmationDialogBody}
        confirmButtonMessage={confirmButtonMessage}
        declineButtonMessage={declineButtonMessage}
        onPrimaryAction={() => {
            onPrimaryAction();
        }}
        onSecondaryAction={() => {
            onSecondaryAction();
        }}
        onDismiss={() => {
            onDismiss();
        }}
    />
);

describe('CustomDialog Snapshots', () => {
    test('Dismissable', () => {
        const tree = renderWithTheme(dialog).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Not Dismissable', () => {
        const tree = renderWithTheme(
            <ConfirmationDialog
                title={confirmationDialogTitle}
                body={confirmationDialogBody}
                confirmButtonMessage={confirmButtonMessage}
                declineButtonMessage={declineButtonMessage}
                dismissable={dismissable}
                onPrimaryAction={() => {
                    onPrimaryAction();
                }}
                onSecondaryAction={() => {
                    onSecondaryAction();
                }}
                onDismiss={() => {
                    onDismiss();
                }}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

describe('Confirmation Dialog Behaviour', () => {
    it('Handles Confirm Button onClick', async () => {
        const { findByText } = renderWithTheme(dialog);

        const button = await findByText(confirmButtonMessage);

        fireEvent.press(button);

        expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    });

    it('Handles Decline Button onClick', async () => {
        const { findByText } = renderWithTheme(dialog);

        const button = await findByText(declineButtonMessage);

        fireEvent.press(button);

        expect(onSecondaryAction).toHaveBeenCalledTimes(1);
    });
});
