import { createStackNavigator } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';

import Me from '../../screens/me/Me';

export type MeStackParamList = {
    Me: {
        articleId: string;
    };
};

const Stack = createStackNavigator<MeStackParamList>();

const HomeStack: FunctionComponent = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Me"
                initialParams={{ articleId: 'me' }}
                options={{ headerShown: false }}
                component={Me}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
