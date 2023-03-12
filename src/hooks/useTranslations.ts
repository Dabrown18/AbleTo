import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectIsServerInitialized, selectServer } from '@src/redux/slices/serverSlice/selectors';
import Logger from '@src/services/logger';
import { getItem, setItem } from '@src/services/storage';
import { getChecksum, getTranslations, SupportedLocale, supportedLocales } from '@src/services/translations';

const useTranslations = () => {
    const server = useSelector(selectServer);
    const isServerInitialized = useSelector(selectIsServerInitialized);

    const isNewChecksum = useCallback(
        async (supportedLocale: SupportedLocale, storedLocale) => {
            try {
                const { data } = await getChecksum(server.apiUrl, supportedLocale);

                return data?.checksum !== storedLocale.checksum;
            } catch (error) {
                if (error.message === 'Network Error') return;
                Logger.error(error);
                return;
            }
        },
        [server.apiUrl]
    );

    const getAndSetTranslations = useCallback(
        async (supportedLocale: SupportedLocale) => {
            try {
                const { data } = await getTranslations(server.apiUrl, supportedLocale);
                setItem(supportedLocale, JSON.stringify(data));
            } catch (error) {
                if (error.message === 'Network Error') return;
                Logger.error(error);
            }
        },
        [server.apiUrl]
    );

    const setTranslations = useCallback(() => {
        supportedLocales.forEach(async (supportedLocale: SupportedLocale) => {
            const storedLocale = await getItem(supportedLocale);

            if (!storedLocale) return getAndSetTranslations(supportedLocale);

            const parsedStoredLocale = JSON.parse(storedLocale);

            if (await isNewChecksum(supportedLocale, parsedStoredLocale)) return getAndSetTranslations(supportedLocale);
        });
    }, [getAndSetTranslations, isNewChecksum]);

    useEffect(() => {
        if (!isServerInitialized) return;

        try {
            setTranslations();
        } catch (error) {
            Logger.error(error);
        }
    }, [server.name, isServerInitialized, setTranslations]);
};

export default useTranslations;
