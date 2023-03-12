import { RootState } from '@src/redux/store';

export const selectAuthState = (state: RootState) => state.auth;

export const selectIsLoading = (state: RootState) => state.auth.isLoadingToken || state.auth.isLoadingUser;
