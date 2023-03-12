import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { RowType } from './SettingsRow';
import { BodyText, Icon } from '@src/core';
import colors from '@src/core/colors';
import { openLink } from '@src/services/helpers';

type Props = {
    item: RowType;
};

const SettingsBrowserRow: FunctionComponent<Props> = ({ item }) => {
    return (
        <Container
            onPress={() => openLink(item.url)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={item.label}
        >
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

export default SettingsBrowserRow;
