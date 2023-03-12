import { RootState } from '@src/redux/store';

export const selectActivityIsBeingInitialized = (state: RootState) =>
    state.activityController.activityIsBeingInitialized;

export const selectActivityController = (state: RootState) => state.activityController.controller;
