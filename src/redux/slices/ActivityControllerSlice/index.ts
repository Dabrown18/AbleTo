import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import ActivityController from '@src/activities/controller/ActivityController';

export interface ActivityControllerState {
    controller: ActivityController | null;
    activityIsBeingInitialized: boolean;
}

const initialState: ActivityControllerState = {
    controller: null,
    activityIsBeingInitialized: false,
};

export const activityControllerSlice = createSlice({
    name: 'activityController',
    initialState,
    reducers: {
        setController: (state, action: PayloadAction<ActivityController>) => {
            state.controller = action.payload;
        },
        setActivityIsBeingInitialized: (state, action: PayloadAction<boolean>) => {
            state.activityIsBeingInitialized = action.payload;
        },
    },
});

export const { actions: activityControllerActions, reducer: activityControllerReducer } = activityControllerSlice;
