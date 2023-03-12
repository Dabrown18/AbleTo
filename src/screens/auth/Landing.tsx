import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { AuthStackParamList } from 'src/navigation/AuthStack';
import styled from 'styled-components/native';

import Logo from '../../assets/images/ableto_logo.svg';
import ScreenScrollView from '../../components/ScreenScrollView';
import { PrimaryButton, SecondaryButton } from '../../core';
import colors from '@src/core/colors';

type ScreenProps = StackScreenProps<AuthStackParamList, 'Landing'>;

const Landing: FunctionComponent<ScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const handleLogin = useCallback(() => navigation.push('EnterEmail'), [navigation]);

    return (
        <ScreenScrollView contentContainerStyle={styles.container}>
            <Logo />

            <ButtonsContainer>
                <PrimaryButton title={t('login_dialog.cta.log_in')} wide onPress={handleLogin} />

                <RegisterButton
                    title={t('log_in.create_an_account')}
                    wide
                    onPress={() => navigation.push('CreateAnAccount')}
                />
            </ButtonsContainer>
        </ScreenScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
    },
});

const ButtonsContainer = styled.View`
    position: absolute;
    bottom: 40px;
    width: 100%;
`;

const RegisterButton = styled(SecondaryButton)`
    margin-top: 20px;
`;

export default Landing;
