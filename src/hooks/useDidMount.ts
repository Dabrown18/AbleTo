import { EffectCallback, useEffect } from 'react';

/**
 * A useEffect hook that will only ever execute once,
 * upon component mount
 */
const useDidMount = (callback: EffectCallback) => {
    useEffect(callback, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useDidMount;
