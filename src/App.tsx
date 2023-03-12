import firebase from '@react-native-firebase/app';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import Braze from 'react-native-appboy-sdk';
import { API_URL } from 'react-native-dotenv';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components'

import DebugMenu from './components/DebugMenu';
import DialogStack from './components/dialogs/DialogStack';
import ServerSelector from './components/ServerSelector';
import { getServerConfig, isServerConfiguration } from './config/server';
import useDidMount from './hooks/useDidMount';
import useI18n from './hooks/useI18n';
import useIdentifyUser from './hooks/useIdentifyUser';
import useServer from './hooks/useServer';
import useTranslations from './hooks/useTranslations';
import AuthStack from './navigation/AuthStack';
import RootNavigation from './navigation/RootNavigation';
import { default as PlatformAnalyticsModule } from './packages/platformAnalytics';
import { activityControllerActions } from './redux/slices/ActivityControllerSlice';
import { authActions } from './redux/slices/authSlice';
import { selectAuthState, selectIsLoading } from './redux/slices/authSlice/selectors';
import { imageActions } from './redux/slices/imageSlice';
import { serverActions } from './redux/slices/serverSlice';
import { selectIsServerInitialized, selectServer } from './redux/slices/serverSlice/selectors';
import platformAnalytics from './services/analytics/platformAnalytics';
import { Doorman } from './services/doorman';
import { getStatusBarHeight, isProdBuild } from './services/helpers';
import { fetchImages } from './services/images';
import { isSelfCare } from './services/program';
import { getItem } from './services/storage';
import { selectIsHome, selectIsInFullScreen } from '@src/redux/slices/statusBarSlice/selectors';


import App: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {setIsFirebaseAuthInitialized} = authActions;
  const isHome = useSelector(selectIsHome);
  const isServerInitialized = useSelector(selectIsServerInitialized);
  const isInFullScreen = useSelector(selectIsInFullScreen);
  const {isAuthenticated, user, isFirebaseAuthInitialized} = useSelector(selectAuthState)
  const isLoading = useSelector(selectIsLoading);
  const {baseUrl} = useSelector(selectServer)
  const {setImages} = imageActions;
  const isI18nInitialized = useI18n();
  const {changeServer} = useServer();

  const appState = useRef(AppState.currentState);

  const statusBarHeight = getStatusBarHeight();
  const fallbackToWebView = !!user && !isSelfCare(user);
  const PERSISTED_SERVER_KEY = 'PERSISTED_SERVER_KEY';

  useTranslations();
  useIdentifyUser();

  const onAppStateChange = AppState.addEventListener('change', async (nextAppState) => {
    if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      await platformAnalytics.persistEvents();
      PlatformAnalyticsModule.startService();
    } else if (nextAppState === 'active' && appState.current.match(/inactive|background/)) {
      await platformAnalytics.flush()
    }

    appState.current = nextAppState
  })

  useEffect(() => {
    if (!isLoading && isI18nInitialized && isServerInitialized) SplashScreen.hide();

    if (user?.external) {
      Braze.changeUser(user.external);
    }

    return () => {
      onAppStateChange.remove()
    }
  }, [isLoading, isI18nInitialized, isServerInitialized, user])

  // Refetch images on server init/change
  useEffect(() => {
    if (!isServerInitialized) return;

    (async () => {
      const {activity_configs} = (await fetchImages(baseUrl)) || {};
      dispatch(setImages({activityImages: activity_configs}));
    })();
  }, [baseUrl, isServerInitialized, setImages])

  useDidMount(() => {
    // Activity Initialized Listener
    const activityInitialized = Doorman.activityInitializedListener((isBeingInitialized: boolean) => {
      dispatch(activityControllerActions.setActivityIsBeingInitialized(isBeingInitialized))
    })

    // Initialized Server
    const initialServerChange = async () => {
      const cachedServerConfigRaw = await getItem(PERSISTED_SERVER_KEY);
      const cachedServerConfig = cachedServerConfigRaw && JSON.parse(cachedServerConfigRaw);

      if (cachedServerConfig && isServerConfiguration(cachedServerConfig)) {
        await changeServer(cachedServerConfig)
      } else {
        const defaultServer = getServerConfig(API_URL);
        await changeServer(defaultServer)
      }
      dispatch(serverActions.setServerIsInitialized());
    }

    // Firebase Auth
    initialServerChange().then(() => {
      const onAuthStateChanged = () => {
        dispatch(setIsFirebaseAuthInitialized(true))
      }

      firebase.app('AUTH').auth().onAuthStateChanged(onAuthStateChanged)
    })

    return () => activityInitialized.remove();
  })

  if (!isI18nInitialized || !isServerInitialized || !isFirebaseAuthInitialized) return null

  return (
    <>
      <DialogStack />
      {isAuthenticated && !fallbackToWebView && !isHome && !isInFullScreen && (
        <StatusBar statusBarHeight={statusBarHeight} />
      )}

      {!isAuthenticated ? <AuthStack /> : <RootNavigation fallbackToWebview={fallbackToWebView} />}

      {!isProdBuild && <ServerSelector />}
      {!isProdBuild && <DebugMenu />}

    </>
  )
}

const StatusBar = styled.View<{ statusBarHeight?: number}>`
  position: absolute;
  height: ${({ statusBarHeight }) => statusBarHeight && `${statusBarHeight}px`};
  width: 100%;
`

export default App;
