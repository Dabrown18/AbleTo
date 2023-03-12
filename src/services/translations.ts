import request from './request';
import { getItem } from './storage';

export type SupportedLocale = 'en' | 'es';

export const supportedLocales: SupportedLocale[] = ['en', 'es'];

// We pull 'browser' type translations
// in order to use the {{moustache}} interpolation style
const translationType = 'browser';

export const getTranslations = async (apiUrl: string, supportedLocale: SupportedLocale) => {
    return await request.get(
        `${apiUrl}/string_bundle?type=${translationType}&locale=${supportedLocale}&skip_wrap_fallback=false`
    );
};

export const getChecksum = async (apiUrl: string, supportedLocale: SupportedLocale) => {
    return await request.get(
        `${apiUrl}/string_bundle/checksum?type=${translationType}&locale=${supportedLocale}&skip_wrap_fallback=false`
    );
};

/**
 * If any run-time translations were downloaded for the locale, fetch these
 * If no run-time translations were downloaded, default to the pre-bundled ones
 */
export const getActiveTranslations = async (locale: SupportedLocale) => {
    const downloadedTranslations = await getItem(locale);

    if (downloadedTranslations) {
        return JSON.parse(downloadedTranslations).strings;
    }

    switch (locale) {
        case 'en':
            return (await import('@src/assets/locales/en.json')).strings;
        case 'es':
            return (await import('@src/assets/locales/es.json')).strings;
        default:
            return (await import('@src/assets/locales/en.json')).strings;
    }
};
