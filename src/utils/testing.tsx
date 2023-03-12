import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React, { ReactNode } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components/native';

import server from './mocks/server';
import { rootNavigation } from '@src/activities/controller/ActivityController';
import linking from '@src/config/deeplinks';
import queryClient from '@src/config/queryClient';
import colors from '@src/core/colors';
import fonts from '@src/core/fonts';
import LoadingIndicator from '@src/core/LoadingIndicator/LoadingIndicator';
import store from '@src/redux/store';

const theme = {
    colors,
    fonts,
};

// Globally exposed testing utils that can be reused across multiple files

export const renderWithTheme = (children: ReactNode) => render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);

// Currently used in tests that involve controller initialization
// as the controller uses the navigator ref
export const renderWithNavigator = (children: ReactNode) => {
    return render(<NavigationContainer ref={rootNavigation}>{children}</NavigationContainer>);
};

const applyProviders = (children: ReactNode) => {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <NavigationContainer linking={linking} ref={rootNavigation} fallback={<LoadingIndicator />}>
                        <PaperProvider>{children}</PaperProvider>
                    </NavigationContainer>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
};

export const renderWithAppProviders = (children: ReactNode) => render(applyProviders(children));

export const createWithAppProviders = (children: ReactNode) => TestRenderer.create(applyProviders(children));

/**
 * Sets up a request interception layer.
 * Should be called when tests involve API calls.
 * @param clearCache Clear QueryClient cache. Defaults to true.
 */
export const initServer = (clearCache = true) => {
    // Sets up the requests interception layer before all tests.
    beforeAll(() => server.listen());
    // Removes any request handlers that were added on runtime
    // and resets QueryClient as consecutive requests to the
    // same endpoint get cached.
    afterEach(() => {
        server.resetHandlers();
        if (clearCache) queryClient.clear();
    });
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    afterAll(() => server.close());
};
