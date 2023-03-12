import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

/**
 * Attaches a listener to the Android hardware back button, that gets cleaned up automatically
 * when the component using the hook unmounts or gets buried in the navigation stack.
 * @param callback The function to execute when a hardware back press occurs. Should return a boolean.
 * When the return value is true the event does not bubble up to other BackHandler callbacks.
 * This also prevents the system default of popping an entry from the navigation stack
 */
const useBackHandler = (callback: () => boolean) => {
    // It's important to utilize useFocusEffect here
    // as the usual component lifecycle will not happen
    // when dealing with navigation, as unshown screens are not unmounted
    useFocusEffect(
        useCallback(() => {
            const handler = BackHandler.addEventListener('hardwareBackPress', callback);

            return () => handler.remove();
        }, [callback])
    );
};

export default useBackHandler;
