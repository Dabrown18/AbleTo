import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NativeDialogContent } from './types';

export type DialogState = {
    shouldShowActivityBackConfirmation: boolean;
    shouldShowActivityExitConfirmation: boolean;
    shouldShowTextEntryExitDialog: boolean;
    shouldShowNoHyperlinkAppDialog: boolean;
    shouldShowUpgradeDialog: boolean;
    shouldShowNativeDialog: boolean;
    shouldShowNoNetworkDialog: boolean;
    shouldShowGenericErrorDialog: boolean;
    shouldShowRootedEmulatedDeviceDialog: boolean;
    isRootedDialog: boolean;
    isMailLink: boolean;
    nativeDialogContent: NativeDialogContent | null;
    shouldShowResetPasswordDialog: boolean;
    userEmail: string;
    shouldShowActiveSIDialog: boolean;
    shouldShowSettingsDialog: boolean;
};

const initialState: DialogState = {
    shouldShowActivityBackConfirmation: false,
    shouldShowActivityExitConfirmation: false,
    shouldShowTextEntryExitDialog: false,
    shouldShowNoHyperlinkAppDialog: false,
    shouldShowUpgradeDialog: false,
    shouldShowNativeDialog: false,
    shouldShowNoNetworkDialog: false,
    shouldShowGenericErrorDialog: false,
    shouldShowRootedEmulatedDeviceDialog: false,
    isRootedDialog: false,
    isMailLink: false,
    nativeDialogContent: null,
    shouldShowResetPasswordDialog: false,
    userEmail: '',
    shouldShowActiveSIDialog: false,
    shouldShowSettingsDialog: false,
};

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        setShouldShowNoNetworkDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowNoNetworkDialog = action.payload;
        },
        setShouldShowUpgradeDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowUpgradeDialog = action.payload;
        },
        setShouldShowNativeDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowNativeDialog = action.payload;
        },
        setNativeDialogContent: (state, action: PayloadAction<NativeDialogContent | null>) => {
            state.nativeDialogContent = action.payload;
        },
        setShouldShowNoHyperlinkAppDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowNoHyperlinkAppDialog = action.payload;
        },
        setIsMailLink: (state, action: PayloadAction<boolean>) => {
            state.isMailLink = action.payload;
        },
        setShouldShowActivityBackConfirmation: (state, action: PayloadAction<boolean>) => {
            state.shouldShowActivityBackConfirmation = action.payload;
        },
        setShouldShowActivityExitConfirmation: (state, action: PayloadAction<boolean>) => {
            state.shouldShowActivityExitConfirmation = action.payload;
        },
        setShouldShowTextEntryExitDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowTextEntryExitDialog = action.payload;
        },
        setShouldShowGenericErrorDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowGenericErrorDialog = action.payload;
        },
        setShouldShowRootedEmulatedDeviceDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowRootedEmulatedDeviceDialog = action.payload;
        },
        setIsRootedDialog: (state, action: PayloadAction<boolean>) => {
            state.isRootedDialog = action.payload;
        },
        setShouldShowResetPasswordDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowResetPasswordDialog = action.payload;
        },
        setUserEmail: (state, action: PayloadAction<string>) => {
            state.userEmail = action.payload;
        },
        setShouldShowActiveSIDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowActiveSIDialog = action.payload;
        },
        setShouldShowSettingsDialog: (state, action: PayloadAction<boolean>) => {
            state.shouldShowSettingsDialog = action.payload;
        },
    },
});

export const { actions: dialogActions, reducer: dialogReducer } = dialogSlice;
