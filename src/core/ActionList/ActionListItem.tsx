import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import colors from '../colors';
import Icon from '../Icon/Icon';
import BodyText from '../Text/BodyText';
import { ItemType } from './types';

type Props = {
    item: ItemType;
    action: Function;
    iconProp?: string;
};

const ActionListItem: FunctionComponent<Props> = ({ item, iconProp, action }) => {
    return (
        <StyledPressable onPress={() => action(item)}>
            {iconProp && item[iconProp] && <StyledIcon icon={item[iconProp]} color={colors.primary600} />}
            <StyledTitle accessibilityRole="button">{item.title}</StyledTitle>
        </StyledPressable>
    );
};

export default ActionListItem;

const StyledPressable = styled.Pressable`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.white};
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const StyledIcon = styled(Icon)`
    margin-right: 15px;
`;

const StyledTitle = styled(BodyText)`
    font-weight: 500;
    font-size: 16px;
    font-family: ${({ theme }) => theme.fonts.FAKT_PRO_MEDIUM};
`;
