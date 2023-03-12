import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AuthStackParamList } from 'src/navigation/AuthStack';
import styled from 'styled-components/native';

import ScreenScrollView from '../../components/ScreenScrollView';
import SignUpThroughButton from './SignUpThroughButton';
import { HeaderText } from '@src/core';
import BodyText from '@src/core/Text/BodyText';
import { selectServer } from '@src/redux/slices/serverSlice/selectors';
import { isProdBuild, openLink } from '@src/services/helpers';

type ScreenProps = StackScreenProps<AuthStackParamList, 'CreateAnAccount'>;

const INSURANCE_LINK_STAGING = 'https://www.ableto.com/health-plan-demo?utm_source=ableto-connect';
const INSURANCE_LINK_PRODUCTION = 'https://www.ableto.com/health-plan?utm_source=ableto-connect';

const CreateAnAccount: FunctionComponent<ScreenProps> = () => {
    const { t } = useTranslation();
    const server = useSelector(selectServer);

    const openInsuranceSignUp = useCallback(() => {
        if (!isProdBuild) {
            openLink(INSURANCE_LINK_STAGING);
        } else {
            openLink(INSURANCE_LINK_PRODUCTION);
        }
    }, []);

    const openAccessCodeSignUp = useCallback(() => {
        openLink(`${server.baseUrl}/placement/eligibility-type/access-code?campaign=self_care`);
    }, [server]);

    return (
        <StyledScreenScrollView>
            <TextContainer>
                <Header variant="h3">{t('create_account.lets_check_your_eligibility')}</Header>
                <Body>{t('create_account.body')}</Body>
            </TextContainer>

            <Footer>
                <SignUpThroughButton title={t('create_account.i_have_an_access_code')} onPress={openAccessCodeSignUp} />
                <SignUpThroughButton
                    title={t('create_account.check_my_insurance_plan')}
                    onPress={() => openInsuranceSignUp()}
                />
                <BodyText variant="sm">{t('create_account.sign_up_help_with_subject')}</BodyText>
            </Footer>
        </StyledScreenScrollView>
    );
};

const TextContainer = styled.View`
    width: 100%;
`;

const Header = styled(HeaderText)`
    margin-bottom: 8px;
`;

const Body = styled(BodyText)`
    margin-bottom: 60px;
`;

const StyledScreenScrollView = styled(ScreenScrollView)`
    flex: 1;
    align-items: center;
    padding: 30px 20px 30px 20px;
`;

const Footer = styled.View`
    width: 100%;
`;

export default CreateAnAccount;
