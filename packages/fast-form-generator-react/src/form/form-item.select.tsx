import * as React from "react";
import IFormItemCommon from "./form-item";
import styles from "./form-item.select.style";
import { IFormItemSelectClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { Foundation, HandledProps, IFoundationProps } from "@microsoft/fast-components-react-base";

/**
 * Select state interface
 */
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
/* tslint:disable-next-line */
class FormItemSelect extends Foundation<IFormItemSelectProps & IManagedClasses<IFormItemSelectClassNameContract>, React.Component<IFormItemSelectProps>, {}> {

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        if (this.props.options.length === 1) {
            return null;
        }

        return (
            <div className={this.props.managedClasses.formItemSelect}>
                <label className={this.props.managedClasses.formItemSelect_label}>
                    {this.props.label}
                </label>
                <span className={this.props.managedClasses.formItemSelect_span}>
                    <select
                        className={this.props.managedClasses.formItemSelect_input}
                        onChange={this.handleChange}
                        value={this.props.data || this.props.default || this.props.options[0]}
                    >
                        {this.renderOptions()}
                    </select>
                </span>
            </div>
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
                <option
                    className={this.props.managedClasses.formItemSelect_option}
                    key={index}
                    value={item}
                >
                    {item}
                </option>
            );
        });
    }
}

export default manageJss(styles)(FormItemSelect);
