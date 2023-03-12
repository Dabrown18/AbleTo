import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, TransitionPresets } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback } from 'react';
import { View } from 'react-native';

import NavigationBackButton from '@src/components/navigation/NavigationBackButton';
import NavigationCloseButton from '@src/components/navigation/NavigationCloseButton';
import NavigationHeaderTitle from '@src/components/navigation/NavigationHeaderTitle';
import WebView from '@src/components/WebView';
import colors from '@src/core/colors';
import useAccessibilityFocus from '@src/hooks/useAccessibilityFocus';
import useTranslation from '@src/hooks/useTranslation';
import CheckYourEmail from '@src/screens/auth/CheckYourEmail';
import CreateAnAccount from '@src/screens/auth/CreateAnAccount';
import EnterEmail from '@src/screens/auth/EnterEmail';
import EnterOTP from '@src/screens/auth/EnterOTP';
import EnterPassword from '@src/screens/auth/EnterPassword';
import Landing from '@src/screens/auth/Landing';

export type AuthStackParamList = {
    Landing: undefined;
    EnterEmail?: {
        message: string;
    };
    EnterPassword: {
        email: string;
    };
    EnterOTP: {
        email: string;
        password: string;
    };
    CheckYourEmail: {
        email: string;
    };
    CreateAnAccount: undefined;
    AuthWebView: {
        initialUrl: string;
        isWebViewPadded?: boolean;
    };
};

type LandingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Landing'>;

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack: FunctionComponent = () => {
    const navigation = useNavigation<LandingScreenNavigationProp>();
    const { ref, setFocus } = useAccessibilityFocus<View>();

    const { t } = useTranslation('log_in');

    const renderTitle = useCallback((title: string) => <NavigationHeaderTitle ref={ref} title={title} />, [ref]);

    return (
        <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: { borderBottomColor: colors.gray300, borderBottomWidth: 1 },
                headerTitle: () => renderTitle(t('log_in')),
                headerLeft: () => <NavigationBackButton onPress={navigation.goBack} />,
                headerRight: () => (
                    <NavigationCloseButton
                        onPress={() => navigation.navigate('Landing')}
                        accessibilityLabel="Go back to Landing"
                    />
                ),
                ...TransitionPresets.SlideFromRightIOS,
            }}
            // @fix: Ensure that new pages have their focus set on the header title
            // will not be necessary once https://github.com/react-navigation/react-navigation/issues/7056 is fixed
            screenListeners={{ transitionEnd: setFocus }}
        >
            <Stack.Screen options={{ headerShown: false }} name="Landing" component={Landing} />
            <Stack.Screen
                name="EnterEmail"
                options={{
                    headerLeft: () => null,
                }}
                component={EnterEmail}
            />
            <Stack.Screen name="EnterPassword" component={EnterPassword} />
            <Stack.Screen
                name="EnterOTP"
                options={{
                    headerLeft: () => <NavigationBackButton onPress={() => navigation.navigate('EnterEmail')} />,
                }}
                component={EnterOTP}
            />
            <Stack.Screen
                options={{
                    headerLeft: () => null,
                    headerTitle: () => renderTitle(t('create_an_account')),
                }}
                name="CreateAnAccount"
                component={CreateAnAccount}
            />
            <Stack.Screen
                name="CheckYourEmail"
                options={{
                    headerLeft: () => null,
                }}
                component={CheckYourEmail}
            />
            <Stack.Screen options={{ headerShown: false }} name="AuthWebView" component={WebView} />
        </Stack.Navigator>
    );
};

export default AuthStack;
