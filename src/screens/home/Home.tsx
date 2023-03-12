import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

import Article from '@src/components/articles/Article';
import HomeBackgroundImage from '@src/components/home/HomeBackgroundImage';
import PaddedStatusBar from '@src/components/statusBars/PaddedStatusBar';
import { LoadingIndicator } from '@src/core';
import useDidMount from '@src/hooks/useDidMount';
import { HomeStackParamList } from '@src/navigation/tabs/HomeStack';
import { statusBarActions } from '@src/redux/slices/statusBarSlice';
import { useGetArticle } from '@src/services/article';

type ScreenProps = StackScreenProps<HomeStackParamList, 'Home'>;

const Home: FunctionComponent<ScreenProps> = () => {
    const dispatch = useDispatch();
    const { data: article, isLoading } = useGetArticle('home');
    const statusBarHeight = useMemo(() => {
        return StatusBar.currentHeight;
    }, []);
    const isFocused = useIsFocused();

    useDidMount(() => {
        dispatch(statusBarActions.setIsHome(true));
    });

    if (!article || isLoading) return <LoadingIndicator />;

    const contentfulHeaderAvailable = article.sections.some((section) =>
        section.items.some((item) => item.contentType === 'header')
    );

    return (
        <FullScreenContainer>
            <PaddedStatusBar isFocused={isFocused} />
            <Article
                article={article}
                ListHeaderComponent={
                    !contentfulHeaderAvailable ? <HomeBackgroundImage statusBarHeight={statusBarHeight} /> : null
                }
            />
        </FullScreenContainer>
    );
};

const FullScreenContainer = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.creamBackground};
`;

export default Home;
