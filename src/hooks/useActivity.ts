import { useDispatch } from 'react-redux';

import useDidMount from './useDidMount';
import { activityActions } from '@src/redux/slices/activitySlice';
import { getItem, setItem } from '@src/services/storage';

const useActivity = () => {
    const dispatch = useDispatch();
    const { setForceNativeActivities } = activityActions;
    const PERSISTED_FORCED_ACTIVITY_KEY = 'PERSISTED_FORCED_ACTIVITY_KEY';

    const toggleForceNativeActivities = (toggleValue: boolean) => {
        dispatch(setForceNativeActivities(toggleValue));
        setItem(PERSISTED_FORCED_ACTIVITY_KEY, toggleValue.toString());
    };

    useDidMount(() => {
        (async () => {
            const cachedActivityConfig = await getItem(PERSISTED_FORCED_ACTIVITY_KEY);

            if (cachedActivityConfig === 'true') {
                dispatch(setForceNativeActivities(true));
            }
        })();
    });

    return { toggleForceNativeActivities };
};

export default useActivity;
