import { createStackNavigator } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';

import Home from '../../screens/home/Home';

export type HomeStackParamList = {
    Home: {
        articleId: string;
    };
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack: FunctionComponent = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                initialParams={{ articleId: 'home' }}
                options={{ headerShown: false }}
                component={Home}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
