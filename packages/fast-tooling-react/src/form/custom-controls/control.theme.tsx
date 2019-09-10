import React from "react";
import { CustomFormControlProps } from "../controls/control.props";
import styles from "./control.theme.style";
import { ThemeFormControlClassNameContract } from "./control.theme.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import BaseFormControl from "../controls/template.control.abstract";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class ThemeFormControl extends BaseFormControl<
    CustomFormControlProps & ManagedClasses<ThemeFormControlClassNameContract>,
    {}
> {
    public static displayName: string = "ThemeFormControl";

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.themeFormControl}>
                <div className={this.props.managedClasses.themeFormControl_control}>
                    <label
                        className={
                            this.props.managedClasses.themeFormControl_controlLabel
                        }
                        htmlFor={this.props.dataLocation}
                    >
                        {this.props.label}
                    </label>
                    <div
                        className={
                            this.props.managedClasses
                                .themeFormControl_controlInputContainer
                        }
                    >
                        {this.renderInput("light", 1)}
                        {this.renderInput("dark", 2)}
                    </div>
                </div>
                <div className={this.props.managedClasses.themeFormControl_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.themeFormControl_softRemoveInput
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
            ? this.props.managedClasses.themeFormControl_controlInput__dark
            : this.props.managedClasses.themeFormControl_controlInput__light;
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

export default manageJss(styles)(ThemeFormControl);
