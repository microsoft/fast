import * as React from "react";
import IFormItemCommon from "./form-item";
import styles from "./form-item.textarea.style";
import { IFormItemTextareaClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

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
class FormItemTextarea extends React.Component<IFormItemTextareaProps & IManagedClasses<IFormItemTextareaClassNameContract>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemTextarea}>
                <label
                    htmlFor={this.props.dataLocation}
                    className={this.props.managedClasses.formItemTextarea_label}
                >
                    {this.props.label}
                </label>
                <textarea
                    className={this.props.managedClasses.formItemTextarea_textarea}
                    id={this.props.dataLocation}
                    name={this.props.dataLocation}
                    rows={typeof this.props.rows === "number" ? this.props.rows : 3}
                    value={this.props.data || ""}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    private handleChange = ({target: { value }}: any): any => {
        return this.props.onChange(this.props.dataLocation, value);
    }
}

export default manageJss(styles)(FormItemTextarea);
