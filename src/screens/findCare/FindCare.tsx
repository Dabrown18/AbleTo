import { useFocusEffect } from '@react-navigation/native';
import React, { FunctionComponent, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

import Article from '@src/components/articles/Article';
import { LoadingIndicator } from '@src/core';
import { dialogActions } from '@src/redux/slices/dialogSlice';
import { useGetArticle } from '@src/services/article';
import { getFlagSet } from '@src/services/flagSet';
import { getStatusBarHeight } from '@src/services/helpers';

const FindCare: FunctionComponent = () => {
    const statusBarHeight = getStatusBarHeight();
    const { data: article, isLoading } = useGetArticle('find-care');

    const dispatch = useDispatch();

    const { setShouldShowActiveSIDialog } = dialogActions;

    const appState = useRef(AppState.currentState);

    useFocusEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                const flags = await getFlagSet();

                if (flags?.needs_active_si_disclaimer) {
                    dispatch(setShouldShowActiveSIDialog(true));
                }
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    });

    if (isLoading || !article) return <LoadingIndicator />;

    return (
        <FullScreenContainer statusBarHeight={statusBarHeight}>
            <Article article={article} />
        </FullScreenContainer>
    );
};

const FullScreenContainer = styled.View<{ statusBarHeight: number | undefined }>`
    flex: 1;
    background-color: ${(props) => props.theme.colors.creamBackground};
    padding-top: ${({ statusBarHeight }) => (statusBarHeight ? `${statusBarHeight}px` : 0)};
`;

export default FindCare;
