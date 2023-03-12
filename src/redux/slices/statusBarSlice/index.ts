import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StatusBarState {
    isHome: boolean;
    isInFullScreen: boolean;
}

const initialState: StatusBarState = {
    isHome: false,
    isInFullScreen: false,
};

export const statusBarSlice = createSlice({
    name: 'statusBar',
    initialState,
    reducers: {
        setIsHome: (state, action: PayloadAction<boolean>) => {
            state.isHome = action.payload;
        },
        setIsInFullScreen: (state, action: PayloadAction<boolean>) => {
            state.isInFullScreen = action.payload;
        },
    },
});

export const { actions: statusBarActions, reducer: statusBarReducer } = statusBarSlice;
