import { useTranslation as useTranslationBase } from 'react-i18next';

const useTranslation = (keyPrefix = '') => useTranslationBase('translation', { keyPrefix });

export default useTranslation;
