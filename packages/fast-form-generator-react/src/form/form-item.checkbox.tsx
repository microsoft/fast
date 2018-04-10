import IFormItemCommon from "./form-item";
import * as React from "react";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemCheckbox extends React.Component<IFormItemCommon, {}> {

    public render(): JSX.Element {
        const value: boolean = (typeof this.props.data === "boolean")
            ? this.props.data
            : this.props.default || false;

        return (
            <React.Fragment>
                <label htmlFor={this.props.dataLocation}>
                    {this.props.label}
                </label>
                <input
                    id={this.props.dataLocation}
                    type="checkbox"
                    value={value.toString()}
                    onChange={this.handleChange}
                    checked={value}
                />
            </React.Fragment>
        );
    }

    /**
     * Handles the onChange of the input element
     */
    private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        return this.props.onChange(this.props.dataLocation, event.target.checked);
    }
}

export default FormItemCheckbox;
