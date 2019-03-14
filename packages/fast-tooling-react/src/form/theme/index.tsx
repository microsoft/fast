import React from "react";
import { CustomFormItemComponent } from "../form/form-item.props";
import styles from "./theme.style";
import { ThemeClassNameContract } from "./theme.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormItemBase from "../form/form-item.base";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemTheme extends FormItemBase<
    CustomFormItemComponent & ManagedClasses<ThemeClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemTheme";

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.theme}>
                <div className={this.props.managedClasses.theme_control}>
                    <label
                        className={this.props.managedClasses.theme_controlLabel}
                        htmlFor={this.props.dataLocation}
                    >
                        {this.props.label}
                    </label>
                    <div
                        className={this.props.managedClasses.theme_controlInputContainer}
                    >
                        {this.renderInput("light", 1)}
                        {this.renderInput("dark", 2)}
                    </div>
                </div>
                <div className={this.props.managedClasses.theme_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.theme_softRemoveInput
                    )}
                </div>
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange(this.props.dataLocation, value);
    };

    private isChecked(theme: string): boolean {
        return (
            this.props.data === theme ||
            (typeof this.props.data === "undefined" && this.props.default === theme)
        );
    }

    private getInputClassName(theme: string): string {
        return theme === "dark"
            ? this.props.managedClasses.theme_controlInput__dark
            : this.props.managedClasses.theme_controlInput__light;
    }

    private renderInput(theme: string, index: number): JSX.Element {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: any = this.props.options.find(
                (item: string): any => {
                    return item === theme;
                }
            );

            if (typeof option !== "undefined") {
                const className: string = this.getInputClassName(theme);

                return (
                    <input
                        className={className}
                        id={this.props.dataLocation}
                        type="radio"
                        value={theme}
                        name="theme"
                        aria-label={`theme ${theme}`}
                        onChange={this.onChange.bind(this, theme)}
                        checked={this.isChecked(theme)}
                    />
                );
            }
        }
    }
}

export default manageJss(styles)(FormItemTheme);
