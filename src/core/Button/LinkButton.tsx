import React, { FunctionComponent, useCallback } from 'react';
import { Text, TextProps } from 'react-native';
import styled from 'styled-components/native';

import { openLink } from '@src/services/helpers';

type Props = {
    title: string;
    link?: string;
} & TextProps;

const LinkButton: FunctionComponent<Props> = ({ title, link, ...rest }) => {
    // Normal usage entails no passed children.
    // If any are present though, we override them with
    // the 'title' prop, which is the text we want to display
    const spread = { ...rest, children: title };

    const handlePress = useCallback(() => openLink(link), [link]);

    return <StyledBodyText accessibilityLabel={title} accessibilityRole="link" onPress={handlePress} {...spread} />;
};

const StyledBodyText = styled(Text)`
    font-family: ${({ theme }) => theme.fonts.FAKT_PRO_NORMAL};
    color: ${({ theme }) => theme.colors.teal600};

    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    text-decoration-line: underline;
`;

export default LinkButton;
