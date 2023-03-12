import React, { FunctionComponent, useState } from 'react';
import { NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import styled from 'styled-components/native';

import { RowType } from './SettingsRow';
import { BodyText } from '@src/core';
import useTranslation from '@src/hooks/useTranslation';
import { Profile, updateSelf } from '@src/services/user';

type Props = {
    userProfile: Profile;
    setUserProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>;
    item: RowType;
};

const SettingsEditRow: FunctionComponent<Props> = ({ userProfile, setUserProfile, item }) => {
    const { t } = useTranslation();
    const [validationError, setValidationError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const onEndEditting = (
        event: NativeSyntheticEvent<TextInputEndEditingEventData>,
        propertyToSet?: keyof Profile
    ) => {
        if (validationError) {
            setIsEditing(false);
            return;
        }

        if (!propertyToSet) return;

        const trimmedText = event.nativeEvent.text.trim();

        setUserProfile((prevProfile) => ({ ...prevProfile, [propertyToSet]: trimmedText } as Profile));
        setIsEditing(false);

        updateSelf({ ...userProfile, [propertyToSet]: trimmedText });
    };

    const onChangeText = (text: string) => {
        const trimmedText = text.trim();

        setIsEditing(true);
        setValidationError(false);

        if (trimmedText.length === 0) {
            setValidationError(true);
        }
    };

    if (!item.property) return null;

    return (
        <>
            <RowHeader>{item.label}</RowHeader>
            {!isEditing && !validationError ? (
                <StyledPressable onPress={() => setIsEditing(true)}>
                    <TouchableField
                        numberOfLines={1}
                        accessible
                        accessibilityLabel={t('profile.name_accessibility_label', { name: userProfile[item.property] })}
                    >
                        {userProfile[item.property]}
                    </TouchableField>
                </StyledPressable>
            ) : (
                <StyledView>
                    <EditableField
                        placeholder={item.label}
                        autoFocus
                        onChangeText={(text) => onChangeText(text)}
                        onEndEditing={(event) => onEndEditting(event, item.property)}
                    >
                        {userProfile[item.property]}
                    </EditableField>
                    {validationError && (
                        <ErrorMessage variant="xs" accessibilityLiveRegion="polite">
                            {t('general.errors.field_required')}
                        </ErrorMessage>
                    )}
                </StyledView>
            )}
        </>
    );
};

const RowHeader = styled(BodyText)`
    color: ${({ theme }) => theme.colors.gray700};
    width: 160px;
`;

const TouchableField = styled(BodyText)`
    color: ${({ theme }) => theme.colors.gray900};
`;

const EditableField = styled.TextInput`
    max-width: 200px;
    color: ${({ theme }) => theme.colors.gray900};
    padding: 0px;
    margin-bottom: -2px;
    margin-top: -2px;
    font-family: ${({ theme }) => theme.fonts.FAKT_PRO_NORMAL};
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
`;

const StyledPressable = styled.Pressable`
    flex-direction: column;
    min-width: 50%;
`;

const StyledView = styled.View`
    flex-direction: column;
    min-width: 50%;
`;

const ErrorMessage = styled(BodyText)`
    color: ${(props) => props.theme.colors.red600};
    position: absolute;
    bottom: -14px;
    left: 0;
`;

export default SettingsEditRow;
