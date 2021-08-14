import React from "react";
import styles, { CSSControlClassNameContract } from "./control.css.style";
import { CSSControlProps, CSSControlState } from "./control.css.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    CSSProperty,
    mapCSSInlineStyleToCSSPropertyDictionary,
} from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { CSSRef } from "./control.css-ref";
import { CSSStandardControlPlugin } from "./css";

/**
 * This is currently experimental, any use of the CSS control must include the following
 * imports and register with the DesignSystem
 *
 * import { DesignSystem } from "@microsoft/fast-foundation";
 * import {
 *    fastCheckbox,
 *    fastNumberField,
 *    fastOption,
 *    fastSelect,
 *    fastTextField,
 * } from "@microsoft/fast-components";
 * import {
 *     fastToolingColorPicker,
 * } from "@microsoft/fast-tooling/dist/esm/web-components";
 *
 * DesignSystem.getOrCreate().register(
 *    fastCheckbox(),
 *    fastNumberField(),
 *    fastOption(),
 *    fastSelect(),
 *    fastTextField(),
 *    fastToolingColorPicker({ prefix: "fast-tooling" }),
 * );
 */

/**
 * Custom form control definition for CSS
 */
class CSSControl extends React.Component<
    CSSControlProps & ManagedClasses<CSSControlClassNameContract>,
    CSSControlState
> {
    constructor(props: CSSControlProps & ManagedClasses<CSSControlClassNameContract>) {
        super(props);

        this.state = mapCSSInlineStyleToCSSPropertyDictionary(this.props.value);
    }

    public render(): React.ReactNode {
        return (
            <div className={classNames(this.props.managedClasses.css)}>
                {this.renderCSSProperties()}
            </div>
        );
    }

    private renderCSSProperties(): React.ReactNode {
        const css = {
            // An object spread is used here to control
            // mutability at the top level of the css prop
            ...this.props.css,
        };
        const renderedCssControls: React.ReactNode[] = [];

        if (this.props.cssControls) {
            this.props.cssControls.forEach(
                (cssControl: CSSStandardControlPlugin): void => {
                    cssControl.updateProps({
                        css: {
                            ...this.state,
                        },
                        onChange: this.handleMultiplePropertyOnChange,
                    });

                    renderedCssControls.push(cssControl.render());
                    cssControl.getPropertyNames().forEach((propertyName: string) => {
                        delete css[propertyName];
                    });
                }
            );
        }

        return [
            ...renderedCssControls,
            ...Object.entries(css).map(
                ([cssPropertyName, cssProperty]: [
                    string,
                    CSSProperty
                ]): React.ReactNode => {
                    return this.renderCSSProperty(
                        cssProperty,
                        cssPropertyName,
                        this.state[cssPropertyName] || ""
                    );
                }
            ),
        ];
    }

    private renderCSSProperty(
        cssProperty: CSSProperty,
        cssPropertyName: string,
        cssPropertyValue: string
    ): React.ReactNode {
        if (!cssProperty || !cssProperty.name || !cssProperty.syntax) {
            return null;
        }

        return (
            <fieldset key={cssPropertyName}>
                <legend>{cssProperty.name}</legend>
                <CSSRef
                    syntax={cssProperty.syntax}
                    onChange={this.handleOnChange(cssPropertyName)}
                    mapsToProperty={cssPropertyName}
                    value={cssPropertyValue}
                    dictionaryId={this.props.dictionaryId}
                    dataLocation={this.props.dataLocation}
                />
            </fieldset>
        );
    }

    private handleMultiplePropertyOnChange = (css: { [key: string]: string }): void => {
        this.setState(
            {
                ...css,
            },
            this.resolveCSS
        );
    };

    private handleOnChange = (propertyName: string): ((value: string) => void) => {
        return (value: string): void => {
            this.setState(
                {
                    [propertyName]: value,
                },
                this.resolveCSS
            );
        };
    };

    private resolveCSS = (): void => {
        this.props.onChange({
            value:
                `${Object.keys(this.state)
                    .reduce((previousValue: string, propertyName: string) => {
                        if (!this.state[propertyName]) {
                            return previousValue;
                        }

                        return `${previousValue} ${propertyName}: ${this.state[propertyName]};`;
                    }, "")
                    .trim()}` || undefined,
        });
    };
}

export { CSSControl };
export default manageJss(styles)(CSSControl);
