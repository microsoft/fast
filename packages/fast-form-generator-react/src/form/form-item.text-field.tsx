import * as React from "react";
import IFormItemCommon from "./form-item";

export interface IFormItemTextFieldProps extends IFormItemCommon {

    /**
     * The type of text field
     */
    type: string;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemTextField extends React.Component<IFormItemTextFieldProps, {}> {

    public render(): JSX.Element {
        const value: string = (typeof this.props.data === "string" || typeof this.props.data === "number")
            ? this.getStringValue(this.props.data)
            : this.getStringValue(this.props.default);

        return (
            <div>
                <label htmlFor={this.getStringValue(this.props.data)}>
                    {this.props.label}
                </label>
                <input
                    id={this.getStringValue(this.props.data)}
                    type={this.props.type}
                    value={value}
                    name={value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    /**
     * Get the string value of a number
     */
    private getStringValue(data: string | number): string {
        if (typeof data === "number") {
            return data.toString();
        }

        return data || "";
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
