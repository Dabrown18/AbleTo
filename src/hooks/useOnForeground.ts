import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Hook that executes a callback function once
 * the app goes into foreground from background
 */
const useOnForeground = (callback: () => any) => {
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                await callback();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [callback]);
};

export default useOnForeground;
