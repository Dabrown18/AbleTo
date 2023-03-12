import { useCallback, useRef, useState } from 'react';
import { addEventListener, getTimeZone, removeEventListener } from 'react-native-localize';

import useDidMount from './useDidMount';
import { CallStatus, getCallStatus, setClientTimeZone } from '@src/services/callStatus';

/**
 * Hook that sends a request to rails to update user's
 * time zone on a component mount and on a time zone change
 */
const useUpdateTimeZone = () => {
    const [timeZone, setTimeZone] = useState(getTimeZone());
    const callStatus = useRef<CallStatus>();

    const updateTimeZone = useCallback(() => {
        const currentTimeZone = getTimeZone();

        if (currentTimeZone === timeZone) return;

        (async () => await setClientTimeZone(currentTimeZone, callStatus.current))();
        setTimeZone(currentTimeZone);
    }, [timeZone]);

    useDidMount(() => {
        (async () => {
            callStatus.current = await getCallStatus();

            setClientTimeZone(timeZone, callStatus.current);
        })();

        addEventListener('change', updateTimeZone);

        return () => removeEventListener('change', updateTimeZone);
    });
};

export default useUpdateTimeZone;
