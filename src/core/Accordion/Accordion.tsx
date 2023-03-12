import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import Animated, { AnimateProps, Layout } from 'react-native-reanimated';

import { AccordionContext } from './AccordionContext';

type Props = {
    isExpanded: boolean;
    onToggle(): void;
} & AnimateProps<ViewProps>;

const Accordion: FunctionComponent<Props> = ({ isExpanded, onToggle, ...rest }) => {
    return (
        <AccordionContext.Provider value={{ isExpanded, onToggle }}>
            <Animated.View layout={Layout} importantForAccessibility="no" {...rest} />
        </AccordionContext.Provider>
    );
};

export default Accordion;
