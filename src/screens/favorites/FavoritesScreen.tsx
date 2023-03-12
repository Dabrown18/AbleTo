import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { BodyText } from '@src/core';
import { RootStackParamList } from '@src/services/activities/types';

type ScreenProps = StackScreenProps<RootStackParamList, 'Favorites'>;

const FavoritesScreen: FunctionComponent<ScreenProps> = ({ route }) => {
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

export default FavoritesScreen;
