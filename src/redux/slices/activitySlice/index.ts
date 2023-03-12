import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ActivityState = {
    forceNativeActivities: boolean;
    habitsFetchedForDate: Date;
};

const initialState: ActivityState = {
    forceNativeActivities: false,
    habitsFetchedForDate: new Date(0),
};

export const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        setForceNativeActivities: (state, action: PayloadAction<boolean>) => {
            state.forceNativeActivities = action.payload;
        },
        setHabitsFetchedForDate: (state, action: PayloadAction<Date>) => {
            state.habitsFetchedForDate = action.payload;
        },
    },
});

export const { actions: activityActions, reducer: activityReducer } = activitySlice;
