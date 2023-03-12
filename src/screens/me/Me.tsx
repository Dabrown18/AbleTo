import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

import MeHeader from './MeHeader';
import Article from '@src/components/articles/Article';
import { LoadingIndicator } from '@src/core';
import useDidMount from '@src/hooks/useDidMount';
import { HomeStackParamList } from '@src/navigation/tabs/HomeStack';
import { statusBarActions } from '@src/redux/slices/statusBarSlice';
import { useGetArticle } from '@src/services/article';
import { getStatusBarHeight } from '@src/services/helpers';

type ScreenProps = StackScreenProps<HomeStackParamList, 'Home'>;

const Home: FunctionComponent<ScreenProps> = () => {
    const dispatch = useDispatch();
    const statusBarHeight = getStatusBarHeight();
    const { data: article, isLoading } = useGetArticle('me');

    useDidMount(() => {
        dispatch(statusBarActions.setIsHome(false));
    });

    if (!article || isLoading) return <LoadingIndicator />;

    return (
        <FullScreenContainer statusBarHeight={statusBarHeight}>
            <Article article={article} ListHeaderComponent={<MeHeader />} />
        </FullScreenContainer>
    );
};

const FullScreenContainer = styled.View<{ statusBarHeight: number | undefined }>`
    flex: 1;
    background-color: ${(props) => props.theme.colors.creamBackground};
    padding-top: ${({ statusBarHeight }) => (statusBarHeight ? `${statusBarHeight}px` : 0)};
    height: 100%;
`;

export default Home;
