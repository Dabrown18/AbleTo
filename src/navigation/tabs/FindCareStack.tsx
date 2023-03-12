import { createStackNavigator } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';

import FindCare from '@src/screens/findCare/FindCare';

export type FindCareStackParamList = {
    FindCare: {
        articleId: string;
    };
};

const Stack = createStackNavigator<FindCareStackParamList>();

const FindCareStack: FunctionComponent = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="FindCare"
                initialParams={{ articleId: 'sessions' }}
                options={{ title: 'Find Care', headerShown: false }}
                component={FindCare}
            />
        </Stack.Navigator>
    );
};

export default FindCareStack;
