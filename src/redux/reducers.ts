import { activityControllerReducer } from './slices/ActivityControllerSlice';
import { activityReducer } from './slices/activitySlice';
import { authReducer } from './slices/authSlice';
import { devMenuReducer } from './slices/devMenuSlice';
import { dialogReducer } from './slices/dialogSlice';
import { imageReducer } from '@src/redux/slices/imageSlice';
import { serverReducer } from '@src/redux/slices/serverSlice';
import { statusBarReducer } from '@src/redux/slices/statusBarSlice';

const reducers = {
    statusBar: statusBarReducer,
    server: serverReducer,
    auth: authReducer,
    activityController: activityControllerReducer,
    activity: activityReducer,
    image: imageReducer,
    dialog: dialogReducer,
    devMenu: devMenuReducer,
};

export default reducers;
