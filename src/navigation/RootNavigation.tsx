import { useNavigation, useNavigationState } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ModalActivityStack from './ModalActivityStack';
import SelfCareTabs from './SelfCareTabs';
import ActivityController from '@src/activities/controller/ActivityController';
import NavigationBackButton from '@src/components/navigation/NavigationBackButton';
import NavigationCloseButton from '@src/components/navigation/NavigationCloseButton';
import NavigationHeaderTitle from '@src/components/navigation/NavigationHeaderTitle';
import WebView from '@src/components/WebView';
import colors from '@src/core/colors';
import useAccessibilityFocus from '@src/hooks/useAccessibilityFocus';
import useDidMount from '@src/hooks/useDidMount';
import useOnProgramLevelSwitch from '@src/hooks/useOnProgramLevelSwitch';
import useTranslation from '@src/hooks/useTranslation';
import useUpdateTimeZone from '@src/hooks/useUpdateTimeZone';
import { activityControllerActions } from '@src/redux/slices/ActivityControllerSlice';
import { selectActivityController } from '@src/redux/slices/ActivityControllerSlice/selectors';
import { dialogActions } from '@src/redux/slices/dialogSlice';
import ActivityStep from '@src/screens/activities/ActivityStep';
import AssessmentStep from '@src/screens/activities/AssessmentStep';
import ArticleScreen from '@src/screens/articles/ArticleScreen';
import FavoritesScreen from '@src/screens/favorites/FavoritesScreen';
import Support from '@src/screens/settings/Support';
import { Doorman } from '@src/services/doorman';
import { showNotificationPrompt } from '@src/services/notifications';

type Props = {
    fallbackToWebview: boolean;
};

/**
 *
 * This is the Root of our Navigation. This component determines
 * which set of tabs to show, based on the Dashboard type. It also houses
 * the ActivityNavigation, which we want to have outside of our tabular navigation
 *
 */
const RootNavigation: FunctionComponent<Props> = ({ fallbackToWebview }) => {
    const Stack = createStackNavigator();
    const controller = useSelector(selectActivityController);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setFocus } = useAccessibilityFocus<View>();
    const { setController } = activityControllerActions;
    const { setShouldShowActivityBackConfirmation, setShouldShowActivityExitConfirmation } = dialogActions;
    const index = useMemo(() => controller?.stepIndex || 0, [controller?.stepIndex]);
    const assessmentIndex = useNavigationState((state) => state?.index);
    const navigationRoutes = useNavigationState((state) => state?.routes);
    const [activityTitle, setActivityTitle] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            if (!controller?.currentStep) return;

            const processedStep = await controller?.processStep(controller.currentStep);

            setActivityTitle(processedStep?.content?.activityTitle ?? controller?.activityConfig?.name ?? '');
        })();
    }, [controller, navigationRoutes]);

    useOnProgramLevelSwitch();

    useUpdateTimeZone();

    useDidMount(() => {
        // Controller Change Listener
        const controllerChanged = Doorman.controllerStateChangeListener((newController: ActivityController) => {
            dispatch(setController(newController));
        });

        // API Level >= 33 Notification prompt
        showNotificationPrompt();

        return () => controllerChanged.remove();
    });

    const showActivityBackConfirmation = useCallback(
        () => dispatch(setShouldShowActivityBackConfirmation(true)),
        [dispatch, setShouldShowActivityBackConfirmation]
    );

    const showActivityExitConfirmation = useCallback(
        () => dispatch(setShouldShowActivityExitConfirmation(true)),
        [dispatch, setShouldShowActivityExitConfirmation]
    );

    const isModal = useMemo(
        () => controller?.isModalStep || controller?.isModal,
        [controller?.isModalStep, controller?.isModal]
    );

    const stepBack = useCallback(() => {
        if (controller?.currentStep?.exitOptions?.showDialogOnBack) {
            return showActivityBackConfirmation();
        }

        controller?.stepBack();
        return;
    }, [controller, showActivityBackConfirmation]);

    const stepBackAssessment = useCallback(() => {
        if (controller?.currentStep?.exitOptions?.showDialogOnBack) {
            return showActivityBackConfirmation();
        }

        controller?.restoreStepIndex();
        navigation.goBack();
        return;
    }, [controller, navigation, showActivityBackConfirmation]);

    const exitActivity = useCallback(() => {
        if (controller?.activityConfig?.options.showDialogOnLeave) {
            return showActivityExitConfirmation();
        }

        controller?.exitActivity();
        return;
    }, [controller, showActivityExitConfirmation]);

    const baseOptions: StackNavigationOptions = useMemo(() => {
        return {
            ...TransitionPresets.SlideFromRightIOS,
            headerStyle: {
                borderBottomColor: colors.gray300,
                borderBottomWidth: 1,
            },
            headerTitle: () => <NavigationHeaderTitle ref={ref} title={activityTitle} />,
            headerTitleAlign: 'center',
            headerLeft: () =>
                index > 1 &&
                controller?.currentStep?.options?.hideBackButton !== true && (
                    <NavigationBackButton onPress={stepBack} />
                ),
            headerRight: () =>
                !controller?.currentStep?.options?.hideCloseButton && (
                    <NavigationCloseButton
                        onPress={exitActivity}
                        accessibilityLabel={t('general.buttons.exit_activity')}
                    />
                ),
        };
    }, [
        ref,
        activityTitle,
        index,
        controller?.currentStep?.options?.hideBackButton,
        controller?.currentStep?.options?.hideCloseButton,
        stepBack,
        exitActivity,
        t,
    ]);

    // Even though we have the  ModalActivityStack we still need the modalScreenOptions
    // here as the Stack.Screen for "ActivityStep" somehow caches the options for ActivityStep
    // and this breaks the TransitionPresets.ModalPresentationIOS transition.
    // Tried adding a separating wrapper component for ActivityStep when displayed
    // in a modal (ModalActivityStack) but that didn't result in fixing this behavior.
    const modalScreenOptions: StackNavigationOptions = useMemo(() => {
        return {
            ...baseOptions,
            ...TransitionPresets.ModalPresentationIOS,
            headerLeft: () =>
                !controller?.isModalStep &&
                controller?.isModal &&
                controller?.currentStep?.options?.hideBackButton !== true && (
                    <NavigationBackButton onPress={stepBack} />
                ),
            presentation: 'transparentModal',
            headerShadowVisible: false,
            detachPreviousScreen: true,
        };
    }, [
        stepBack,
        baseOptions,
        controller?.isModalStep,
        controller?.isModal,
        controller?.currentStep?.options?.hideBackButton,
    ]);

    return (
        <Stack.Navigator
            // Non self-care users see the WebView, instead of the tabs
            initialRouteName={fallbackToWebview ? 'WebView' : 'Tabs'}
            screenOptions={{
                headerStyle: {
                    borderBottomColor: colors.gray300,
                    borderBottomWidth: 1,
                },
                ...TransitionPresets.SlideFromRightIOS,
            }}
            // @fix: Ensure that new pages have their focus set on the header title
            // will not be necessary once https://github.com/react-navigation/react-navigation/issues/7056 is fixed
            // we don't want to focus in a modal as that will be done in `ModalActivityStack`
            screenListeners={isModal ? undefined : { transitionEnd: setFocus }}
        >
            <Stack.Screen name="Tabs" options={{ headerShown: false }} component={SelfCareTabs} />
            <Stack.Screen name="WebView" options={{ headerShown: false }} component={WebView} />
            <Stack.Screen
                name="Article"
                options={{
                    headerTitle: ({ children: title }) => (
                        <NavigationHeaderTitle ref={ref} title={title ?? 'Article'} />
                    ),
                    headerTitleAlign: 'center',
                    headerLeft: ({ onPress }) => <NavigationBackButton onPress={onPress} />,
                }}
                component={ArticleScreen}
            />
            <Stack.Screen
                name="Favorites"
                options={{
                    headerTitle: () => <NavigationHeaderTitle ref={ref} title="Favorites" />,
                    headerTitleAlign: 'center',
                    headerLeft: ({ onPress }) => <NavigationBackButton onPress={onPress} />,
                }}
                component={FavoritesScreen}
            />
            <Stack.Screen
                name="ActivityStep"
                component={ActivityStep}
                options={isModal ? modalScreenOptions : baseOptions}
            />
            <Stack.Screen name="ModalActivityStack" options={{ ...modalScreenOptions, headerShown: false }}>
                {() => <ModalActivityStack modalScreenOptions={modalScreenOptions} setTitleFocus={setFocus} />}
            </Stack.Screen>
            <Stack.Screen
                name="Assessment"
                options={{
                    ...baseOptions,
                    headerLeft: () =>
                        assessmentIndex > 1 && <NavigationBackButton onPress={() => stepBackAssessment()} />,
                }}
                component={AssessmentStep}
            />
            <Stack.Screen
                name="Support"
                options={{
                    headerTitle: () => <NavigationHeaderTitle title={t('support.header')} />,
                    headerLeft: ({ onPress }) => <NavigationBackButton onPress={onPress} />,
                    headerTitleAlign: 'center',
                }}
                component={Support}
            />
        </Stack.Navigator>
    );
};

export default RootNavigation;
