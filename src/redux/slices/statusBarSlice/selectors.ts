import { RootState } from '@src/redux/store';

export const selectIsHome = (state: RootState) => state.statusBar.isHome;

export const selectIsInFullScreen = (state: RootState) => state.statusBar.isInFullScreen;
