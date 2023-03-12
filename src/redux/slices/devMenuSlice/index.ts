import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type devMenuState = {
    toggleMeTab: boolean;
};

const initialState: devMenuState = {
    toggleMeTab: false,
};

export const devMenuSlice = createSlice({
    name: 'devMenu',
    initialState,
    reducers: {
        setToggleMeTab: (state, action: PayloadAction<boolean>) => {
            state.toggleMeTab = action.payload;
        },
    },
});

export const { actions: devMenuActions, reducer: devMenuReducer } = devMenuSlice;
