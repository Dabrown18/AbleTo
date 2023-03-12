import { useDispatch } from 'react-redux';

import useDidMount from './useDidMount';
import { dialogActions } from '@src/redux/slices/dialogSlice';
import { Doorman } from '@src/services/doorman';

const useRegisterDialogListeners = () => {
    const dispatch = useDispatch();

    const {
        setIsMailLink,
        setShouldShowNoHyperlinkAppDialog,
        setShouldShowUpgradeDialog,
        setShouldShowGenericErrorDialog,
    } = dialogActions;

    useDidMount(() => {
        const unableToOpenUrlListener = Doorman.unableToOpenUrlListener((linkType) => {
            dispatch(setIsMailLink(linkType));
            dispatch(setShouldShowNoHyperlinkAppDialog(true));
        });
        const upgradeListener = Doorman.upgrade(() => dispatch(setShouldShowUpgradeDialog(true)));
        const genericErrorListener = Doorman.genericErrorListener(() =>
            dispatch(setShouldShowGenericErrorDialog(true))
        );

        return () => {
            unableToOpenUrlListener.remove();
            upgradeListener.remove();
            genericErrorListener.remove();
        };
    });
};

export default useRegisterDialogListeners;
