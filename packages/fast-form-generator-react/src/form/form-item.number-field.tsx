import * as React from "react";
import FormItemCommon from "./form-item";
import { getStringValue } from "./form-item.utilities";
import styles from "./form-item.number-field.style";
import { FormItemNumberFieldClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormItemBase from "./form-item.base";

export interface FormItemNumberFieldProps extends FormItemCommon {
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
class FormItemNumberField extends FormItemBase<
    FormItemNumberFieldProps & ManagedClasses<FormItemNumberFieldClassNameContract>,
    {}
> {
    public render(): JSX.Element {
        const value: string = getStringValue(this.props.data, this.props.default);

        return (
            <div className={this.props.managedClasses.formItemNumberField}>
                <div className={this.props.managedClasses.formItemNumberField_control}>
                    <label
                        className={
                            this.props.managedClasses.formItemNumberField_control_label
                        }
                        htmlFor={this.props.dataLocation}
                    >
                        {this.props.label}
                    </label>
                    <input
                        className={
                            this.props.managedClasses.formItemNumberField_control_input
                        }
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
                <div className={this.props.managedClasses.formItemNumberField_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.formItemNumberField_softRemove_input
                    )}
                </div>
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
    };
}

export default manageJss(styles)(FormItemNumberField);
