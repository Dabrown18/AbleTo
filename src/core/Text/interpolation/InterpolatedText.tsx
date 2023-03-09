import React, { ComponentType, FunctionComponent, ReactNode, useMemo } from 'react';
import { TextProps } from 'react-native';

type ComponentProp = {
    component: ComponentType | FunctionComponent<any>;
    // TextProps and any bonus additions for
    // custom functional components that are passed
    props?: TextProps & { [name: string]: any };
};

type Props = {
    text: string;
    /** Key Value Pairs of stylistic interpolation keys,
     * with {component, props} object values used to wrap every
     * different stylistic interpolation, based on the key
     * @usage
     * With the following translation 'This is {{#bold}}BOLD!{{/bold}}
     *
     * <InterpolatedMessage styleInterpolationValues={{bold: { component: SomeBoldText } }} />
     *
     * @returns
     * 'This is <b>BOLD!</b>'
     *
     * Where 'BOLD!' will be styled by the `SomeBoldText` component
     */
    values?: Record<string, ComponentProp>;
    /** Wrapper for the entire text. Defaults to Body 1 */
    WrapperComponent: ComponentType;
    wrapperComponentProps?: TextProps & { [name: string]: any };
};

/** A component used for wrapping text
 * in stylistic interpolation mustache brackets - {{#gray800}}
 *
 * Supports stylistic interpolation,
 * and custom text wrappers
 *
 * @usage
 * Can be used as an alternative of `t`
 *
 * `<InterpolatedMessage id="log_in.welcome_back" />`
 *
 * instead of
 *
 * `<BodyText>{t('log_in.welcome_back')}</BodyText>`
 *
 */
const InterpolatedMessage: FunctionComponent<Props> = ({
    values: styleInterpolationValues = {},
    WrapperComponent,
    wrapperComponentProps = {},
    text,
}) => {
    const row = useMemo(() => {
        const nodes: ReactNode[] = [];
        let currentStyles: string[] = [];
        let currentInterpolation: ReactNode = null;

        const openingInterpolation = new RegExp(/{{#\w+}}/im);
        const closingInterpolation = new RegExp(/{{\/\w+}}/im);
        const selfClosingInterpolation = new RegExp(/\{{{.*\}}}/);

        const cleanInterpolation = (str: string) => str.replace(/\{|#|\}|\//gim, '');

        const isIcon = (style: string) => {
            // Most icons contain 'Icon' in the name but we have some cases
            // that this is not present so we check by the specific icon name.
            const iconNames = ['Icon', 'volumeUpOutlined'];
            return !!iconNames.find((icon) => style.includes(icon));
        };

        const words = text.match(/([^{}]+)|(\{[^}]*\}*)/gim) || [];

        words.forEach((word, index) => {
            if (word === '{targetSelf}') {return;}

            if (selfClosingInterpolation.test(word)) {
                if (cleanInterpolation(word) === 'br') {
                    word = '\n';
                }
            }

            // If the current word is an interpolation, add it to the list of styles
            if (openingInterpolation.test(word) || selfClosingInterpolation.test(word))
                {return currentStyles.push(cleanInterpolation(word));}

            // If the current word is a closing interpolation, discard it
            if (closingInterpolation.test(word)) {return;}

            // If the current word is NOT an interpolation:
            if (!openingInterpolation.test(word)) {
                // If styles exist, add them
                // and clear out styles
                if (currentStyles.length) {
                    currentStyles.forEach((style) => {
                        if (!currentInterpolation) {currentInterpolation = word;}

                        // We do not return if style contains an icon name.
                        if (!styleInterpolationValues[style] && !isIcon(style)) {return;}

                        const { component: Component, props = {} } =
                            styleInterpolationValues[style] ?? styleInterpolationValues.icon;

                        if (style === 'a') {
                            // Links have a special format, which we can use
                            // to extract both the title and link
                            // ex: [help@ableto.com](mailto:help@ableto.com)
                            const [title, link] = word.split(']');

                            // Removes the leading [ from the title
                            props.title = `${title.replace('[', '')} `;

                            // Removes the ( ) from the link
                            props.link = link.replace(/\(|\)/gi, '');
                        }

                        if (isIcon(style)) {
                            props.icon = style;
                            props.style = { marginRight: 8 };
                        }

                        currentInterpolation = (
                            <Component key={index} {...props}>
                                {currentInterpolation}
                            </Component>
                        );
                    });

                    currentStyles = [];

                    nodes.push(currentInterpolation);
                    currentInterpolation = null;
                    return;
                }

                // If styles do not exist, add the word to nodes

                return nodes.push(word);
            }

            return;
        });

        return nodes;
        // return nodes;
    }, [text, styleInterpolationValues]);

    return <WrapperComponent {...wrapperComponentProps}>{row}</WrapperComponent>;
};

export default InterpolatedMessage;
