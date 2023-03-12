import { createStackNavigator } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';

import NavigationHeaderTitle from '@src/components/navigation/NavigationHeaderTitle';
import useTranslation from '@src/hooks/useTranslation';
import Settings from '@src/screens/settings/Settings';

const Stack = createStackNavigator();

const SettingsStack: FunctionComponent = () => {
    const { t } = useTranslation('general.pages.settings');

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Settings"
                options={{
                    headerShown: true,
                    headerTitle: () => <NavigationHeaderTitle title={t('label')} />,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        borderBottomWidth: 1,
                    },
                }}
                component={Settings}
            />
        </Stack.Navigator>
    );
};

export default SettingsStack;
