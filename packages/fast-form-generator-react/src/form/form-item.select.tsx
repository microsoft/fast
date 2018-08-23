import * as React from "react";
import IFormItemCommon from "./form-item";
import styles from "./form-item.select.style";
import { IFormItemSelectClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

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
class FormItemSelect extends React.Component<IFormItemSelectProps & IManagedClasses<IFormItemSelectClassNameContract>, {}> {

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        if (this.props.options.length === 1) {
            return null;
        }

        const value: any = (typeof this.props.data !== "undefined")
            ? this.props.data
            : this.props.default || this.props.options[0];

        return (
            <div className={this.props.managedClasses.formItemSelect}>
                <label className={this.props.managedClasses.formItemSelect_label}>
                    {this.props.label}
                </label>
                <span className={this.props.managedClasses.formItemSelect_span}>
                    <select
                        className={this.props.managedClasses.formItemSelect_input}
                        onChange={this.handleChange}
                        value={JSON.stringify(value)}
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
        this.props.onChange(this.props.dataLocation, this.parse((event.target as HTMLSelectElement).value));
    }

    /**
     * Renders the selects option elements
     */
    private renderOptions(): JSX.Element[] {
        return this.props.options.map((item: any, index: number) => {
            const stringifiedItem: string = this.stringify(item);
            return (
                <option
                    key={index}
                    value={stringifiedItem}
                >
                    {typeof item === "string" || typeof item === "number" ? item : stringifiedItem}
                </option>
            );
        });
    }

    private stringify(value: any): string | any {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }

    private parse(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
}

export default manageJss(styles)(FormItemSelect);
