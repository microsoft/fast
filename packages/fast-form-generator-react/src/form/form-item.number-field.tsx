import * as React from "react";
import IFormItemCommon from "./form-item";
import { getStringValue } from "./form-item.utilities";
import styles from "./form-item.number-field.style";
import { IFormItemNumberFieldClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IFormItemNumberFieldProps extends IFormItemCommon {
    /**
     * The minimum value allowed
     */
    min?: number;

    /**
     * The maximum value allowed
     */
    max?: number;

    /**
     * The increment between steps
     */
    step?: number;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemNumberField extends React.Component<IFormItemNumberFieldProps & IManagedClasses<IFormItemNumberFieldClassNameContract>, {}> {

    public render(): JSX.Element {
        const value: string = getStringValue(this.props.data, this.props.default);

        return (
            <div className={this.props.managedClasses.formItemNumberField}>
                <label
                    className={this.props.managedClasses.formItemNumberField_label}
                    htmlFor={this.props.dataLocation}
                >
                    {this.props.label}
                </label>
                <input
                    className={this.props.managedClasses.formItemNumberField_input}
                    id={this.props.dataLocation}
                    type="number"
                    value={value}
                    name={`number${value}`}
                    onChange={this.handleChange}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                />
            </div>
        );
    }

    /**
     * Make sure this is not NaN
     */
    private getNumberValue(value: string): number {
        const newValue: number = parseFloat(value);
        if (!isNaN(newValue)) {
            return newValue;
        }

        return this.props.data;
    }

    /**
     * Handles the onChange event for the input
     */
    private handleChange = ({ target: { value } }: any): void => {
        const normalizedValue: number = this.getNumberValue(value);
        return this.props.onChange(this.props.dataLocation, normalizedValue);
    }
}

export default manageJss(styles)(FormItemNumberField);
