import React, { FunctionComponent, useMemo } from 'react';
import { TextProps } from 'react-native';
import styled from 'styled-components';

import LinkButton from '../../Button/LinkButton';
import colors, { Color } from '../../colors';
import InterpolatedMessage from './InterpolatedMessage';
import Icon from '@src/core/Icon/Icon';
import { isDebug } from '@src/services/helpers';
import Logger from '@src/services/logger';

type ComponentType = { component: React.ComponentType; componentProps: TextProps & { [name: string]: any } };
type InternalComponentType = { component: React.ComponentType; props: TextProps & { [name: string]: any } };

type Props = ComponentType & TextProps;

/**
 *
 * Component is meant for internal use, by
 * other exposed 'Text' components
 *
 * The InterpolatedText will take any text child,
 * render it inside of the passed 'component'
 * and take care of any stylistic interpolation
 *
 */
const InterpolatedText: FunctionComponent<Props> = ({ children, component, componentProps: props, ...rest }) => {
    const FontSemiBold = styled(component)`
        font-family: ${({ theme }) => theme.fonts.FAKT_PRO_MEDIUM};
        font-weight: 500;
    `;

    const Bold = styled(component)`
        font-weight: bold;
    `;

    const Italic = styled(component)`
        font-style: italic;
    `;

    const Header4Big = styled(component)`
        font-family: ${({ theme }) => theme.fonts.FAKT_PRO_NORMAL};
        color: ${({ theme }) => theme.colors.gray800};
        font-size: 20px;
        line-height: 28px;
    `;

    // Creates a Key Value Pair that interpolates
    // each color from our Palette
    const colorValues = Object.keys(colors).reduce((acc: Record<string, InternalComponentType>, curr) => {
        acc[curr] = {
            component,
            props: {
                ...props,
                style: { ...(props.style as object), color: colors[curr as Color] },
            },
        };

        return acc;
    }, {});

    const text = useMemo(() => {
        if (typeof children === 'string') {return children;}
        if (typeof children === 'number') {return children.toString();}
        if (Array.isArray(children)) {return children.join('');}

        // Our Text components are always used together
        // with i18n translations, which return either a string
        // or an array. If usage is incorrect, skip the text
        // and alert if running in DEBUG mode
        if (isDebug) {
            Logger.error(
                new Error('Incorrect Text usage. Expected a string or array child. Are you passing a translation?')
            );
        }
        return '';
    }, [children]);

    return (
        <InterpolatedMessage
            text={text}
            WrapperComponent={component}
            wrapperComponentProps={{ ...props, ...rest }}
            values={{
                a: { component: LinkButton, props },
                fontSemiBold: { component: FontSemiBold, props },
                bold: { component: Bold, props },
                italic: { component: Italic, props },
                icon: { component: Icon, props },
                header4Big: { component: Header4Big, props },
                ...colorValues,
            }}
        />
    );
};

export default InterpolatedText;
