import { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

// react-hook-form doesn't actually export the type
// for it's validators, which is a shame
// To work around this, we copy over the type and export it for use
// in our different validators
export type HookFormValidation = Omit<
    RegisterOptions<FieldValues, FieldPath<FieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
>;
