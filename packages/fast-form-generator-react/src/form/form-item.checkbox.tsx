import * as React from "react";
import IFormItemCommon from "./form-item";
import styles from "./form-item.checkbox.style";
import { IFormItemCheckboxClassNameContract } from "../class-name-contracts/";
import manageJss, { IManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemCheckbox extends React.Component<IFormItemCommon & IManagedClasses<IFormItemCheckboxClassNameContract>, {}> {

    public render(): JSX.Element {
        const value: boolean = (typeof this.props.data === "boolean")
            ? this.props.data
            : this.props.default || false;

        return (
            <div className={this.props.managedClasses.formItemCheckbox}>
                <label className={this.props.managedClasses.formItemCheckbox_label} htmlFor={this.props.dataLocation}>
                    {this.props.label}
                </label>
                <input
                    className={this.props.managedClasses.formItemCheckbox_input}
                    id={this.props.dataLocation}
                    type="checkbox"
                    value={value.toString()}
                    onChange={this.handleChange}
                    checked={value}
                />
                <span />
            </div>
        );
    }

    /**
     * Handles the onChange of the input element
     */
    private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        return this.props.onChange(this.props.dataLocation, event.target.checked);
    }
}

export default manageJss(styles)(FormItemCheckbox);
