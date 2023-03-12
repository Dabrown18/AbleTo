import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Template } from '@src/services/activities/types';

type ImageResources = { activityImages?: Record<Template, Record<string, Record<string, string>>> };

export interface ImageState {
    images: ImageResources;
}

const initialState: ImageState = {
    images: {},
};

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        setImages: (state, action: PayloadAction<ImageResources>) => {
            state.images = action.payload;
        },
    },
});

export const { actions: imageActions, reducer: imageReducer } = imageSlice;
