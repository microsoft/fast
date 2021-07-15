import React from "react";
import styles from "./control.css.style";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames } from "@microsoft/fast-web-utilities";
import { mapCSSInlineStyleToCSSPropertyDictionary } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { CSSRef } from "./control.css-ref";
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
class CSSControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleMultiplePropertyOnChange = css => {
            this.setState(Object.assign({}, css), this.resolveCSS);
        };
        this.handleOnChange = propertyName => {
            return value => {
                this.setState(
                    {
                        [propertyName]: value,
                    },
                    this.resolveCSS
                );
            };
        };
        this.resolveCSS = () => {
            this.props.onChange({
                value:
                    `${Object.keys(this.state)
                        .reduce((previousValue, propertyName) => {
                            if (!this.state[propertyName]) {
                                return previousValue;
                            }
                            return `${previousValue} ${propertyName}: ${this.state[propertyName]};`;
                        }, "")
                        .trim()}` || undefined,
            });
        };
        this.state = mapCSSInlineStyleToCSSPropertyDictionary(this.props.value);
    }
    render() {
        return (
            <div className={classNames(this.props.managedClasses.css)}>
                {this.renderCSSProperties()}
            </div>
        );
    }
    renderCSSProperties() {
        const css = Object.assign({}, this.props.css);
        const renderedCssControls = [];
        if (this.props.cssControls) {
            this.props.cssControls.forEach(cssControl => {
                cssControl.updateProps({
                    css: Object.assign({}, this.state),
                    onChange: this.handleMultiplePropertyOnChange,
                });
                renderedCssControls.push(cssControl.render());
                cssControl.getPropertyNames().forEach(propertyName => {
                    delete css[propertyName];
                });
            });
        }
        return [
            ...renderedCssControls,
            ...Object.entries(css).map(([cssPropertyName, cssProperty]) => {
                return this.renderCSSProperty(
                    cssProperty,
                    cssPropertyName,
                    this.state[cssPropertyName] || ""
                );
            }),
        ];
    }
    renderCSSProperty(cssProperty, cssPropertyName, cssPropertyValue) {
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
}
export { CSSControl };
export default manageJss(styles)(CSSControl);
