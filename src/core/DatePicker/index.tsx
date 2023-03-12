import DateTimePickerBase, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { FunctionComponent, useCallback, useState } from 'react';

type Props = {
    date: Date;
    maximumDate?: Date;
    onDateChange(newDate?: Date): void;
    onDismiss(): void;
};

const DatePicker: FunctionComponent<Props> = ({ date, maximumDate, onDateChange, onDismiss }) => {
    const [newDate, setNewDate] = useState(date);

    const onChange = useCallback(
        (event: DateTimePickerEvent, selectedDate?: Date) => {
            if (event.type === 'dismissed') {
                return onDismiss();
            }

            selectedDate && setNewDate(selectedDate);
            onDateChange(selectedDate);
            onDismiss();
        },
        [onDateChange, onDismiss]
    );

    return <DateTimePickerBase mode="date" value={newDate} onChange={onChange} maximumDate={maximumDate} />;
};

export default DatePicker;
