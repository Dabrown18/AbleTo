import DateTimePickerBase, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { FunctionComponent, useCallback, useState } from 'react';

import useTranslation from '@src/hooks/useTranslation';

type DatePickerMode = 'date' | 'time';

type Props = {
    date: Date;
    minuteInterval?: number;
    minimumDate?: Date;
    maximumDate?: Date;

    onDateChange(newDate?: Date): void;
    onDismiss(): void;
};

const DateTimePicker: FunctionComponent<Props> = ({
    date,
    minuteInterval,
    minimumDate,
    maximumDate,
    onDateChange,
    onDismiss,
}) => {
    const { t } = useTranslation('general.buttons');

    // Start off by displaying the date picker
    const [mode, setMode] = useState<DatePickerMode>('date');
    const [newDate, setNewDate] = useState(date);

    const onChange = useCallback(
        (event: DateTimePickerEvent, selectedDate?: Date) => {
            // The neutral button is only displayed in the 'time' control
            // and allows users to go back to selecting a date
            if (event.type === 'neutralButtonPressed') {
                return setMode('date');
            }

            if (event.type === 'dismissed') {
                return onDismiss();
            }

            // If we're currently showing the date picker
            // jump to the time one, after a user makes a selection
            if (mode === 'date') {
                setMode('time');
                selectedDate && setNewDate(selectedDate);
            } else {
                // If we've selected a value for the time
                // close out the entire picker
                selectedDate && setNewDate(selectedDate);
                onDateChange(selectedDate);
                onDismiss();
            }
        },
        [mode, onDateChange, onDismiss]
    );

    return (
        <DateTimePickerBase
            neutralButtonLabel={mode === 'time' ? t('back') : undefined}
            mode={mode}
            value={newDate}
            onChange={onChange}
            minuteInterval={minuteInterval}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
        />
    );
};

export default DateTimePicker;
