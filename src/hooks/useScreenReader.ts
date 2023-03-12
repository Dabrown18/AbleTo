import { useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import useDidMount from './useDidMount';

const useScreenReader = () => {
    const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

    useDidMount(() => {
        AccessibilityInfo.isScreenReaderEnabled().then((enabled) => setScreenReaderEnabled(enabled));

        const listener = AccessibilityInfo.addEventListener('screenReaderChanged', (isEnabled) =>
            setScreenReaderEnabled(isEnabled)
        );

        return () => listener.remove();
    });

    return screenReaderEnabled;
};

export default useScreenReader;
