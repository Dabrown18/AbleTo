import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import Article from '@src/components/articles/Article';
import { LoadingIndicator } from '@src/core';
import { ExploreStackParamList } from '@src/navigation/tabs/ExploreStack';
import { useGetArticle } from '@src/services/article';
import { getStatusBarHeight } from '@src/services/helpers';

type ScreenProps = StackScreenProps<ExploreStackParamList, 'Explore'>;
const Explore: FunctionComponent<ScreenProps> = () => {
    const statusBarHeight = getStatusBarHeight();
    const { data: article, isLoading } = useGetArticle('explore');

    if (isLoading || !article) return <LoadingIndicator />;

    return (
        <FullScreenContainer statusBarHeight={statusBarHeight}>
            <Article article={article} />
        </FullScreenContainer>
    );
};

const FullScreenContainer = styled.View<{ statusBarHeight: number | undefined }>`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.creamBackground};
    padding-top: ${({ statusBarHeight }) => (statusBarHeight ? `${statusBarHeight}px` : 0)};
`;

export default Explore;
