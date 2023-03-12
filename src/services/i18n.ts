import i18n, { TOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { capitalize } from './helpers';
import colors from '@src/core/colors';

const PASSTHROUGH_VARS = [
    'a',
    'bold',
    'caption',
    'header3',
    'header4',
    'header5',
    'ul',
    'li',
    'table',
    'tr',
    'th',
    'td',
    'marker',
    'internalLink',
    ...Object.keys(colors),
];

export const initI18n = async (translation: Object) => {
    // Currently only supporting EN
    // When we start supporting spanish, or other locales
    // we'll want to dynamically change the 'lng' property,
    // based on a user locale value
    // as well as add additional KVPs to the
    // resources property
    i18n.use(initReactI18next).init({
        compatibilityJSON: 'v3',
        resources: {
            en: {
                translation,
            },
        },
        load: 'languageOnly',

        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
            format: (value, format) => {
                if (format === 'capitalize') {
                    return capitalize(value);
                }

                // @todo: Add date and pluralization formatters
                return value;
            },
            // Copied over from web
            // Used to wrap any interpolation,
            // if it is not wrapped in handlebars {{}}
            defaultVariables: {
                ...PASSTHROUGH_VARS.reduce(
                    (acc, wrapper) => ({
                        ...acc,
                        [`#${wrapper}`]: `{{#${wrapper}}}`,
                        [`/${wrapper}`]: `{{/${wrapper}}}`,
                    }),
                    {}
                ),
            },
        },
    });
};

export const translate = (id: string, values?: TOptions) => i18n.t(id, values)?.toString();

export default i18n;
