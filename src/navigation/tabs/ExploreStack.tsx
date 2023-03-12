import { createStackNavigator } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';

import Explore from '@src/screens/explore/Explore';
import Favorites from '@src/screens/favorites/Favorites';

export type ExploreStackParamList = {
    Explore: {
        articleId: string;
    };
    Favorites: {
        articleId: string;
        path: string;
    };
};

const Stack = createStackNavigator<ExploreStackParamList>();

const ExploreStack: FunctionComponent = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                initialParams={{ articleId: 'explore' }}
                name="Explore"
                options={{ headerShown: false }}
                component={Explore}
            />
            <Stack.Screen
                initialParams={{ articleId: 'favorites' }}
                name="Favorites"
                options={{ headerShown: false }}
                component={Favorites}
            />
        </Stack.Navigator>
    );
};

export default ExploreStack;
