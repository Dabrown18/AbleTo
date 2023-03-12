import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { RowType } from './SettingsRow';
import { BodyText } from '@src/core';
import { User } from '@src/services/user';

type Props = {
    item: RowType;
    user: User;
};

const SettingsNonEditRow: FunctionComponent<Props> = ({ item, user }) => {
    return (
        <>
            <RowHeader>{item.label}</RowHeader>
            <ValueField numberOfLines={1}>{user.email}</ValueField>
        </>
    );
};

const RowHeader = styled(BodyText)`
    color: ${({ theme }) => theme.colors.gray700};
    width: 160px;
`;

const ValueField = styled(BodyText)`
    flex: 1;
    color: ${({ theme }) => theme.colors.gray900};
`;

export default SettingsNonEditRow;
