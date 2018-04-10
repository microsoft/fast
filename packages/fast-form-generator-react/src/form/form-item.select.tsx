import * as React from "react";
import IFormItemCommon from "./form-item";

export interface IFormItemSelectProps extends IFormItemCommon {

    /**
     * The select options
     */
    options: any[];
}

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemSelect extends React.Component<IFormItemSelectProps, {}> {

    public render(): JSX.Element {
        if (this.props.options.length === 1) {
            return null;
        }

        return (
            <React.Fragment>
                <label>
                    {this.props.label}
                </label>
                <select
                    onChange={this.handleChange}
                    value={this.props.data || this.props.default || this.props.options[0]}
                >
                    {this.renderOptions()}
                </select>
            </React.Fragment>
        );
    }

    /**
     * Handles the onChange of the select element
     */
    private handleChange = (event: React.FormEvent<HTMLSelectElement>): void => {
        this.props.onChange(this.props.dataLocation, (event.target as HTMLSelectElement).value);
    }

    /**
     * Renders the selects option elements
     */
    private renderOptions(): JSX.Element[] {
        const value: any = (typeof this.props.data !== "undefined")
            ? this.props.data
            : this.props.default || this.props.options[0];

        return this.props.options.map((item: any, index: number) => {
            return (
                <option key={index} value={item}>{item}</option>
            );
        });
    }
}

export default FormItemSelect;
