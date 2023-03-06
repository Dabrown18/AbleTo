import { NavigationContainer } from '@react-navigation/native';
import React, {FunctionComponent} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClientProvider} from 'react-query';
import { Provider } from 'react-redux';
import styled, {ThemeProvider} from 'styled-components/native';

import {rootNavigation} from './activities/controller/ActivityController';
import colors from './core/colors';
import fonts from './core/fonts';
import App from '@src/App';
import linking from '@src/config/deeplinks';
import queryClient from '@src/config/queryClient';
import {LoadingIndicator} from '@src/core';
import {store} from '@src/redux/store';

const theme = {
  colors,
  fonts,
};

const Root: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRoot>
          <ThemeProvider theme={theme}>
            <NavigationContainer linking={linking} ref={rootNavigation} fallback={<LoadingIndicator />}>
              <PaperProvider>
                <App />
              </PaperProvider>
            </NavigationContainer>
          </ThemeProvider>
        </GestureHandlerRoot>
      </QueryClientProvider>
    </Provider>
  );
};

const GestureHandlerRoot = styled(GestureHandlerRootView)`
  flex: 1
`;

export default Root;
