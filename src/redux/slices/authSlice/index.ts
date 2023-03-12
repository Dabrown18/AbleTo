import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@src/services/user';

export type AuthState = {
    isAuthenticated: boolean;
    isLoading: boolean;
    idpToken: string;
    jwtToken: string;
    user?: User;
    isLoadingToken: boolean;
    isLoadingUser: boolean;
    isFirebaseAuthInitialized: boolean;
    featureFlags: Record<string, boolean>;
};

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    idpToken: '',
    jwtToken: '',
    isLoadingToken: false,
    isLoadingUser: false,
    isFirebaseAuthInitialized: false,
    featureFlags: {},
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setJwtToken: (state, action: PayloadAction<string>) => {
            state.jwtToken = action.payload;
        },
        setIdpToken: (state, action: PayloadAction<string>) => {
            state.idpToken = action.payload;
        },
        setIsLoadingUser: (state, action: PayloadAction<boolean>) => {
            state.isLoadingUser = action.payload;
        },
        setIsLoadingToken: (state, action: PayloadAction<boolean>) => {
            state.isLoadingToken = action.payload;
        },
        setUser: (state, action: PayloadAction<User | undefined>) => {
            state.user = action.payload;
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setIsFirebaseAuthInitialized: (state, action: PayloadAction<boolean>) => {
            state.isFirebaseAuthInitialized = action.payload;
        },
        setFeatureFlags: (state, action: { payload: Record<string, boolean> }) => {
            state.featureFlags = action.payload;
        },
    },
});

export const { actions: authActions, reducer: authReducer } = authSlice;
