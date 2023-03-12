import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from 'react-native-dotenv';

import { getServerConfig, ServerConfiguration } from '@src/config/server';

export type ServerState = {
    server: ServerConfiguration;
    isSelectorVisible: boolean;
    isServerInitialized: boolean;
};

const initialState: ServerState = {
    server: getServerConfig(API_URL),
    isSelectorVisible: false,
    isServerInitialized: false,
};

export const serverSlice = createSlice({
    name: 'server',
    initialState,
    reducers: {
        showSelector: (state) => {
            state.isSelectorVisible = true;
        },
        hideSelector: (state) => {
            state.isSelectorVisible = false;
        },
        setServerIsInitialized: (state) => {
            state.isServerInitialized = true;
        },
        setServer: (state, action: PayloadAction<ServerConfiguration>) => {
            state.server = action.payload;
        },
    },
});

export const { actions: serverActions, reducer: serverReducer } = serverSlice;
