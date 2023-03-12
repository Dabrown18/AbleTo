import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useDidMount from './useDidMount';
import useNoInternet from './useNoNetwork';
import RootBeer from '@src/packages/rootBeer';
import { selectAuthState } from '@src/redux/slices/authSlice/selectors';
import { dialogActions } from '@src/redux/slices/dialogSlice';
import analytics from '@src/services/analytics/analytics';
import { getFlagSet } from '@src/services/flagSet';
import { isDevBuild, isDeviceEmulated } from '@src/services/helpers';
import { isSelfCare } from '@src/services/program';

const useDialogs = () => {
    const dispatch = useDispatch();
    const shouldShowNoNetworkDialog = useNoInternet();
    const { user } = useSelector(selectAuthState);

    const {
        setShouldShowNoNetworkDialog,
        setIsRootedDialog,
        setShouldShowRootedEmulatedDeviceDialog,
        setShouldShowActivityBackConfirmation,
        setShouldShowActivityExitConfirmation,
        setShouldShowActiveSIDialog,
    } = dialogActions;

    // No Network Dialog
    useEffect(() => {
        dispatch(setShouldShowNoNetworkDialog(shouldShowNoNetworkDialog));
    }, [shouldShowNoNetworkDialog, dispatch, setShouldShowNoNetworkDialog]);

    // Rooted/Emulator Device Dialogs
    useDidMount(() => {
        if (isDevBuild) return;

        (async function () {
            if (await isDeviceEmulated()) {
                dispatch(setIsRootedDialog(false));
                dispatch(setShouldShowRootedEmulatedDeviceDialog(true));
                analytics.track('Emulator detected');
                return;
            }
        })();

        (async () => {
            if (await RootBeer.isRooted()) {
                dispatch(setIsRootedDialog(true));
                dispatch(setShouldShowRootedEmulatedDeviceDialog(true));
                analytics.track('Root detected');
                return;
            }
        })();
    });

    // Active SI Dialog
    useEffect(() => {
        if (!user) return;

        (async () => {
            if (!isSelfCare(user)) return;
            const flags = await getFlagSet();

            if (flags?.needs_active_si_disclaimer) {
                dispatch(setShouldShowActiveSIDialog(true));
            }
        })();
    }, [dispatch, setShouldShowActiveSIDialog, user]);

    const dismissActivityBackConfirmation = () => dispatch(setShouldShowActivityBackConfirmation(false));
    const dismissActivityExitConfirmation = () => dispatch(setShouldShowActivityExitConfirmation(false));

    return { dismissActivityBackConfirmation, dismissActivityExitConfirmation };
};

export default useDialogs;
