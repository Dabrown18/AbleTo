import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ExploreStack from './tabs/ExploreStack';
import FindCareStack from './tabs/FindCareStack';
import HomeStack from './tabs/HomeStack';
import MeStack from './tabs/MeStack';
import SettingsStack from './tabs/SettingsStack';
import { Icon } from '@src/core';
import colors from '@src/core/colors';
import useTranslation from '@src/hooks/useTranslation';
import { selectAuthState } from '@src/redux/slices/authSlice/selectors';
import { selectDevMenuState } from '@src/redux/slices/devMenuSlice/selectors';
import { statusBarActions } from '@src/redux/slices/statusBarSlice';
import { isProdBuild } from '@src/services/helpers';

const Tab = createBottomTabNavigator();

const SelfCareTabs: FunctionComponent = () => {
    const dispatch = useDispatch();
    const ICON_SIZE = 20;
    const { toggleMeTab } = useSelector(selectDevMenuState);
    const { featureFlags } = useSelector(selectAuthState);

    // @todo: Remove the client side feature flag once all products enable the Me tab in Production.
    // @todo: To be replaced with useCurrentProductIdentifier() once feature/JOY-12899 is merged in.
    const productIdentifier = 'self_care';
    // @todo: To be moved to useCurrentProductIdentifier hook once feature/JOY-12899 is merged in.
    const productIdentifierToFeatureFlagMap = {
        self_care: 'self_care_me_tab',
    };
    const remoteFeatureFlag = featureFlags[productIdentifierToFeatureFlagMap[productIdentifier]];
    const shouldShowMeTab = isProdBuild ? remoteFeatureFlag && toggleMeTab : toggleMeTab;

    const { t } = useTranslation('general.pages');

    const HOME_LABEL = t('home.label');
    const EXPLORE_LABEL = t('explore.label');
    const FIND_CARE_LABEL = t('find_care.label');
    const SETTINGS_LABEL = t('settings.label');
    const ME_LABEL = t('me.label');

    return (
        <Tab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                tabBarActiveTintColor: colors.primary600,
                tabBarInactiveTintColor: colors.gray600,
                tabBarLabelStyle: { marginTop: 8 },
                tabBarStyle: styles.tabBar,
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                options={{
                    tabBarLabel: HOME_LABEL,
                    tabBarAccessibilityLabel: HOME_LABEL,
                    tabBarTestID: 'home-tab',
                    tabBarIcon: ({ focused }) => <Icon icon={focused ? 'homeFocused' : 'home'} size={ICON_SIZE} />,
                }}
                listeners={{
                    tabPress: () => {
                        dispatch(statusBarActions.setIsHome(true));
                    },
                }}
                component={HomeStack}
            />

            <Tab.Screen
                name="ExploreTab"
                options={{
                    tabBarLabel: EXPLORE_LABEL,
                    tabBarAccessibilityLabel: EXPLORE_LABEL,
                    tabBarTestID: 'explore-tab',
                    tabBarIcon: ({ focused, color }) => (
                        <Icon icon={focused ? 'exploreFocused' : 'explore'} size={ICON_SIZE} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: () => {
                        dispatch(statusBarActions.setIsHome(false));
                    },
                }}
                component={ExploreStack}
            />

            <Tab.Screen
                name="FindCareTab"
                options={{
                    tabBarLabel: FIND_CARE_LABEL,
                    tabBarAccessibilityLabel: FIND_CARE_LABEL,
                    tabBarTestID: 'find-care-tab',
                    tabBarIcon: ({ focused, color }) => (
                        <Icon icon={focused ? 'findCareFocused' : 'findCare'} size={ICON_SIZE} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: () => {
                        dispatch(statusBarActions.setIsHome(false));
                    },
                }}
                component={FindCareStack}
            />

            <Tab.Screen
                name="SettingsTab"
                options={{
                    tabBarLabel: SETTINGS_LABEL,
                    tabBarAccessibilityLabel: SETTINGS_LABEL,
                    tabBarTestID: 'settings-tab',
                    tabBarIcon: ({ focused, color }) => (
                        <Icon icon={focused ? 'settingsFocused' : 'settings'} size={ICON_SIZE} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: () => {
                        dispatch(statusBarActions.setIsHome(false));
                    },
                }}
                component={SettingsStack}
            />

            {shouldShowMeTab && (
                <Tab.Screen
                    name="MeTab"
                    options={{
                        tabBarLabel: ME_LABEL,
                        tabBarAccessibilityLabel: ME_LABEL,
                        tabBarTestID: 'me-tab',
                        tabBarIcon: ({ focused, color }) => (
                            <Icon icon={focused ? 'userFocused' : 'user'} size={ICON_SIZE} color={color} />
                        ),
                    }}
                    listeners={{
                        tabPress: () => {
                            dispatch(statusBarActions.setIsHome(false));
                        },
                    }}
                    component={MeStack}
                />
            )}
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.white,
        height: 60,
        paddingTop: 10,
        paddingBottom: 10,
    },
});

export default SelfCareTabs;
