import { HookFormValidation } from './types';
import { translate } from '@src/services/i18n';

export const emailValidation = () => {
    const validation: HookFormValidation = {
        required: translate('general.errors.field_required'),
        pattern: {
            value: new RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}'),
            message: translate('general.errors.email_not_valid'),
        },
    };

    return validation;
};

export const passwordValidation = () => {
    const validation: HookFormValidation = {
        required: translate('general.errors.field_required'),
    };

    return validation;
};

export const newPasswordValidation = () => {
    const validation: HookFormValidation = {
        required: translate('general.errors.field_required'),
        minLength: {
            value: 8,
            message: translate('general.errors.password_length', { minLength: 8 }),
        },
    };

    return validation;
};

export const otpValidation = () => {
    const validation: HookFormValidation = {
        required: translate('general.errors.field_required'),
        minLength: {
            value: 6,
            message: translate('general.errors.otp'),
        },
        maxLength: {
            value: 6,
            message: translate('general.errors.otp'),
        },
    };

    return validation;
};
