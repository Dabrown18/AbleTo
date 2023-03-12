import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';

import ActivityStep from '@src/screens/activities/ActivityStep';

type Props = {
    modalScreenOptions: StackNavigationOptions;
    setTitleFocus: () => void;
};

const ModalActivityStack: FunctionComponent<Props> = ({ modalScreenOptions, setTitleFocus }) => {
    const ModalStack = createStackNavigator();

    return (
        <ModalStack.Navigator screenOptions={modalScreenOptions}>
            <ModalStack.Screen
                name="ModalActivityStep"
                component={ActivityStep}
                options={{ ...modalScreenOptions, ...TransitionPresets.SlideFromRightIOS }}
                // @fix: Ensure that new pages have their focus set on the header title
                // will not be necessary once https://github.com/react-navigation/react-navigation/issues/7056 is fixed
                listeners={{ transitionEnd: setTitleFocus }}
            />
        </ModalStack.Navigator>
    );
};

export default ModalActivityStack;
