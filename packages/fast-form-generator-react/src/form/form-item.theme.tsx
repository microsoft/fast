import * as React from "react";
import { IFormItemComponentMappingToProperyNamesProps } from "./form-item";
import styles from "./form-item.theme.style";
import { IFormItemThemeClassNameContract } from "../class-name-contracts/";
import manageJss, { IManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemTheme extends React.Component<IFormItemComponentMappingToProperyNamesProps & IManagedClasses<IFormItemThemeClassNameContract>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemTheme}>
                <label
                    className={this.props.managedClasses.formItemTheme_label}
                    htmlFor={this.props.dataLocation}
                >
                    {this.props.label}
                </label>
                <div className={this.props.managedClasses.formItemTheme_inputContainer}>
                    {this.renderInput("light", 1)}
                    {this.renderInput("dark", 2)}
                </div>
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange(this.props.dataLocation, value);
    }

    private isChecked(theme: string): boolean {
        return this.props.data === theme || (typeof this.props.data === "undefined" && this.props.default === theme);
    }

    private getInputClassName(theme: string): string {
        return theme === "dark"
            ? this.props.managedClasses.formItemTheme_input__dark
            : this.props.managedClasses.formItemTheme_input__light;
    }

    private renderInput(theme: string, index: number): JSX.Element {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: any = this.props.options.find((item: string): any => {
                return item === theme;
            });

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
