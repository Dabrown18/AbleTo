import { useEffect, useState } from 'react';

import { initI18n } from '@src/services/i18n';
import { getActiveTranslations, SupportedLocale } from '@src/services/translations';

const useI18n = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    const locale: SupportedLocale = 'en';

    useEffect(() => {
        (async () => {
            const translations = await getActiveTranslations(locale);
            await initI18n(translations);
            setIsInitialized(true);
        })();
    }, []);

    return isInitialized;
};

export default useI18n;
