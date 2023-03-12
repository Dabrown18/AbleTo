import { RootState } from '@src/redux/store';

export const selectImages = (state: RootState) => state.image.images;
