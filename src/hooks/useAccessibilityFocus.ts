import { Component, useCallback, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

/**
 * Exposes a ref and a `setFocus` function.
 * Calling `setFocus` will ensure that the element that was passed the `ref` object
 * will be focused by any active Screen Readers
 */
const useAccessibilityFocus = <T extends Component>() => {
    const ref = useRef<T>(null);

    const setFocus = useCallback(() => {
        const handle = findNodeHandle(ref.current);

        if (!handle) return;

        AccessibilityInfo.setAccessibilityFocus(handle);
    }, []);

    return { ref, setFocus };
};

export default useAccessibilityFocus;
