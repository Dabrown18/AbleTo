import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { BodyText } from '@src/core';
import { ExploreStackParamList } from '@src/navigation/tabs/ExploreStack';

type Props = StackScreenProps<ExploreStackParamList, 'Favorites'>;

const Favorites: FunctionComponent<Props> = ({ route }) => {
    const { path } = route.params;

    return (
        <Container>
            <BodyText>Favorites path: {path}</BodyText>
        </Container>
    );
};

const Container = styled.View`
    min-height: 100%;
    background-color: ${(props) => props.theme.colors.creamBackground};
`;

export default Favorites;
