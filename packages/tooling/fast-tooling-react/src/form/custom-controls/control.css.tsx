/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */

import React from "react";
import styles, { CSSControlClassNameContract } from "./control.css.style";
import { CSSControlProps, CSSControlState } from "./control.css.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { classNames } from "@microsoft/fast-web-utilities";
import { CSSProperty } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { CSSRef } from "./control.css-ref";
import { FASTDesignSystemProvider } from "@microsoft/fast-components";

/*
 * Ensure that tree-shaking doesn't remove these components from the bundle.
 * There are multiple ways to prevent tree shaking, of which this is one.
 */
FASTDesignSystemProvider;

/**
 * Custom form control definition for CSS
 */
class CSSControl extends React.Component<
    CSSControlProps & ManagedClasses<CSSControlClassNameContract>,
    CSSControlState
> {
    constructor(props: CSSControlProps & ManagedClasses<CSSControlClassNameContract>) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <div className={classNames(this.props.managedClasses.css)}>
                <fast-design-system-provider use-defaults>
                    {this.renderCSSProperties()}
                </fast-design-system-provider>
            </div>
        );
    }

    private renderCSSProperties(): React.ReactNode {
        return Object.entries(this.props.css).map(
            ([cssPropertyName, cssProperty]: [string, CSSProperty]): React.ReactNode => {
                return this.renderCSSProperty(cssProperty, cssPropertyName);
            }
        );
    }

    private renderCSSProperty(
        cssProperty: CSSProperty,
        cssPropertyName: string
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
                />
            </fieldset>
        );
    }

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
