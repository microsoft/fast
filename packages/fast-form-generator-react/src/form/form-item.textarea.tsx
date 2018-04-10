import * as React from "react";
import IFormItemCommon from "./form-item";

export interface IFormItemTextareaProps extends IFormItemCommon {

    /**
     * The unique index for the section
     */
    index: number;

    /**
     * The number of rows to assign to the textarea
     */
    rows?: number;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemTextarea extends React.Component<IFormItemTextareaProps, {}> {

    public render(): JSX.Element {
        return (
            <div className="context-form">
                <label htmlFor={this.props.dataLocation}>{this.props.label}</label>
                <textarea
                    id={this.props.dataLocation}
                    name={this.props.dataLocation}
                    rows={typeof this.props.rows === "number" ? this.props.rows : 3}
                    value={this.props.data}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    private handleChange = ({target: { value }}: any): any => {
        return this.props.onChange(this.props.dataLocation, value);
    }
}

export default FormItemTextarea;
