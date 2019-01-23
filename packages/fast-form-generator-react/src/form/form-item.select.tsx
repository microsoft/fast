import * as React from "react";
import FormItemCommon from "./form-item";
import styles from "./form-item.select.style";
import { FormItemSelectClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormItemBase from "./form-item.base";

/**
 * Select state interface
 */
export interface FormItemSelectProps extends FormItemCommon {
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
class FormItemSelect extends FormItemBase<
    FormItemSelectProps & ManagedClasses<FormItemSelectClassNameContract>,
    {}
> {
    /**
     * Renders the component
     */
    public render(): JSX.Element {
        if (this.props.options.length === 1) {
            return null;
        }

        const value: any =
            typeof this.props.data !== "undefined"
                ? this.props.data
                : this.props.default || this.props.options[0];

        return (
            <div className={this.props.managedClasses.formItemSelect}>
                <div className={this.props.managedClasses.formItemSelect_control}>
                    <label
                        className={this.props.managedClasses.formItemSelect_controlLabel}
                    >
                        {this.props.label}
                    </label>
                    <span className={this.generateControlSpanClassNames()}>
                        <select
                            className={
                                this.props.managedClasses.formItemSelect_controlInput
                            }
                            onChange={this.handleChange}
                            value={JSON.stringify(value)}
                            disabled={this.props.disabled}
                        >
                            {this.renderOptions()}
                        </select>
                    </span>
                </div>
                <div className={this.props.managedClasses.formItemSelect_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.formItemSelect_softRemoveInput
                    )}
                </div>
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateControlSpanClassNames(): string {
        let classNames: string = this.props.managedClasses.formItemSelect_controlSpan;

        if (this.props.disabled) {
            classNames = `${classNames} ${
                this.props.managedClasses.formItemSelect_controlSpan__disabled
            }`;
        }

        return classNames;
    }

    /**
     * Handles the onChange of the select element
     */
    private handleChange = (event: React.FormEvent<HTMLSelectElement>): void => {
        this.props.onChange(
            this.props.dataLocation,
            this.parse((event.target as HTMLSelectElement).value)
        );
    };

    /**
     * Stringify the select value
     */
    private stringify(value: any): string | any {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }

    /**
     * Parse the select value
     */
    private parse(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    /**
     * Renders the selects option elements
     */
    private renderOptions(): JSX.Element[] {
        return this.props.options.map((item: any, index: number) => {
            const stringifiedItem: string = this.stringify(item);
            return (
                <option key={index} value={stringifiedItem}>
                    {typeof item === "string" || typeof item === "number"
                        ? item
                        : stringifiedItem}
                </option>
            );
        });
    }
}

export default manageJss(styles)(FormItemSelect);
