import * as React from "react";
import { getStringValue } from "./form-item.utilities";
import FormItemCommon from "./form-item";

export interface FormItemTextFieldProps extends FormItemCommon {

    /**
     * The type of text field
     */
    type: string;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemTextField extends React.Component<FormItemTextFieldProps, {}> {

    public render(): JSX.Element {
        const value: string = getStringValue(this.props.data, this.props.default);

        return (
            <div>
                <label htmlFor={this.props.dataLocation}>
                    {this.props.label}
                </label>
                <input
                    id={this.props.dataLocation}
                    type={this.props.type}
                    value={value}
                    name={value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    /**
     * Make sure this is not NaN
     */
    private getNumberValue(value: string): number {
        const newValue: number = parseInt(value, 10);

        if (!isNaN(newValue)) {
            return newValue;
        }

        return this.props.data;
    }

    /**
     * Handles the onChange of the input element
     */
    private handleChange = ({target: { value }}: any): any => {
        const normalizedValue: number | string = value;
        return this.props.onChange(this.props.dataLocation, normalizedValue);
    }
}

export default FormItemTextField;
