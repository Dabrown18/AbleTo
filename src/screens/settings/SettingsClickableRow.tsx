import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { RowType } from './SettingsRow';
import { BodyText, Icon } from '@src/core';
import colors from '@src/core/colors';

type Props = {
    item: RowType;
};

const SettingsClickableRow: FunctionComponent<Props> = ({ item }) => {
    const onPress = () => {
        if (!item.callback) return;

        item.callback();
    };

    return (
        <Container onPress={onPress} accessible accessibilityRole="button" accessibilityLabel={item.label}>
            <BodyText accessibilityRole="button">{item.label}</BodyText>
            <StyledView>
                <Icon icon="chevronRight" color={colors.gray500} />
            </StyledView>
        </Container>
    );
};

const Container = styled.Pressable`
    display: flex;
    flex-direction: row;
    flex: 1 1;
    align-items: center;
`;

const StyledView = styled.View`
    margin-right: 0px;
    margin-left: auto;
`;

export default SettingsClickableRow;
