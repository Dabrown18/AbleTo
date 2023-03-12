import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components/native';

import Article from '@src/components/articles/Article';
import { LoadingIndicator } from '@src/core';
import { RootStackParamList } from '@src/services/activities/types';
import { useGetArticle } from '@src/services/article';

type ScreenProps = StackScreenProps<RootStackParamList, 'Article'>;

const ArticleScreen: FunctionComponent<ScreenProps> = ({ route, navigation }) => {
    const { articleId } = route.params;
    const { data: article, isLoading } = useGetArticle(articleId);

    useEffect(() => {
        if (!article || !article.name) return;

        navigation.setOptions({ title: article.name });
    }, [article, navigation]);

    if (isLoading || !article) return <LoadingIndicator />;

    return (
        <Container>
            <Article article={article} />
        </Container>
    );
};

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.creamBackground};
`;

export default ArticleScreen;
