import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { AuthStackParamList } from '../../navigation/AuthStack';
import AuthHeader from '@src/components/auth/AuthHeader';
import ScreenScrollView from '@src/components/ScreenScrollView';
import BodyText from '@src/core/Text/BodyText';

type ScreenProps = StackScreenProps<AuthStackParamList, 'CheckYourEmail'>;

const CheckYourEmail: FunctionComponent<ScreenProps> = ({ route }) => {
    const { t } = useTranslation();

    return (
        <ScreenScrollView>
            <AuthHeader title={t('log_in.check_your_email')} />

            <StyledBodyText>{t('log_in.check_email_form.body', { email: route.params.email })}</StyledBodyText>
        </ScreenScrollView>
    );
};

const StyledBodyText = styled(BodyText)`
    margin: 0 5px 10px 5px;
    align-items: flex-end;
`;

export default CheckYourEmail;
