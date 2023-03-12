import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import reducers from './reducers';
import { isDevBuild } from '@src/services/helpers';

const logger = createLogger();

const middleware = isDevBuild ? [logger] : [];

export const store = configureStore({
    reducer: reducers,
    middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
