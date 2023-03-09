import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import Animated, { AnimateProps, FadeInUp, FadeOutUp, Layout } from 'react-native-reanimated';
import styled from 'styled-components/native';

import { useAccordion } from './AccordionContext';

type Props = AnimateProps<ViewProps>;

const AccordionList: FunctionComponent<Props> = ({ children, ...rest }) => {
    const { isExpanded } = useAccordion();

    if (!isExpanded) return null;

    return (
        <ListContainer
            layout={Layout}
            entering={FadeInUp.duration(200).springify()}
            exiting={FadeOutUp.duration(200).springify()}
            {...rest}
        >
            {children}
        </ListContainer>
    );
};

const ListContainer = styled(Animated.View)`
    overflow: hidden;
`;

export default AccordionList;
