import { RootState } from '@src/redux/store';

export const selectServer = (state: RootState) => state.server.server;

export const selectIsSelectorVisible = (state: RootState) => state.server.isSelectorVisible;

export const selectIsServerInitialized = (state: RootState) => state.server.isServerInitialized;
