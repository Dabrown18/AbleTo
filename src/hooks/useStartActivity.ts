import { RouteProp, StackActions, useRoute } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ActivityController, {
    PreviousActivityContext,
    rootNavigation,
} from '@src/activities/controller/ActivityController';
import { activityControllerActions } from '@src/redux/slices/ActivityControllerSlice';
import { selectActivityController } from '@src/redux/slices/ActivityControllerSlice/selectors';
import { selectActivityState } from '@src/redux/slices/activitySlice/selectors';
import { FetchConfigArgs } from '@src/services/activities';
import analytics from '@src/services/analytics/analytics';
import { isActivitySupported, toSnakeCase } from '@src/services/helpers';
import Logger from '@src/services/logger';

/**
 * Returns a function that fetches an activity config,
 * then fetches or creates a user_activity entry in the DB,
 * finally constructs a new ActivityController with the config & activity
 * and calls Controller.startActivity(), starting the activity
 *
 * The created Controller is passed to the ActivityControllerState
 * and thus made available to the entire application
 */
const useStartActivity = () => {
    const dispatch = useDispatch();
    const { name, params }: RouteProp<{ params: { articleId: string } }, 'params'> = useRoute();
    const { forceNativeActivities } = useSelector(selectActivityState);
    const controller = useSelector(selectActivityController);
    const isFromActivity = useMemo(() => name.toString() === 'ActivityStep', [name]);
    const fromActivitySlug = isFromActivity ? controller?.slug : undefined;

    const startActivity = useCallback(
        async ({ activitySlug, userActivityId, programActivityId, userId }: FetchConfigArgs, trackAnalytics = true) => {
            const launchedFrom = params?.articleId ?? fromActivitySlug ?? toSnakeCase(name);

            if (!isActivitySupported(activitySlug, programActivityId) && !forceNativeActivities) {
                const activitySlugWeb = activitySlug.replace(/_/g, '-');
                const initialUrl =
                    programActivityId !== activitySlug
                        ? `/activities/${activitySlugWeb}?program_activity_id=${programActivityId}&launched_from=${launchedFrom}`
                        : `/activities/${activitySlugWeb}?launched_from=${launchedFrom}`;

                return rootNavigation.dispatch(StackActions.push('WebView', { initialUrl, isWebViewPadded: true }));
            }

            try {
                let previousActivityContext: PreviousActivityContext | null = null;

                const ctrl = controller ? controller : new ActivityController();

                // If we have a controller, we have an already started activity,
                // so we want to store the previous activity state
                if (controller?.activityConfig) {
                    previousActivityContext = {
                        activityConfig: controller.activityConfig,
                        navigationIndex: rootNavigation.getRootState().index,
                        userActivity: controller?.userActivity,
                    };
                }

                await ctrl.initializeActivity(activitySlug, userActivityId, programActivityId, userId);
                dispatch(activityControllerActions.setController(ctrl));
                ctrl.startActivity(previousActivityContext);
                if (trackAnalytics) {
                    analytics.launchedActivity(activitySlug, programActivityId ?? activitySlug, launchedFrom);
                }
            } catch (error) {
                Logger.error(error, 'Failed to start an activity');
            }
        },
        [forceNativeActivities, controller, dispatch, params?.articleId, fromActivitySlug, name]
    );

    return { startActivity };
};

export default useStartActivity;
