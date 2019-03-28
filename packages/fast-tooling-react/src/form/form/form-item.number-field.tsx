import React from "react";
import { get } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { getStringValue } from "../utilities";
import styles from "./form-item.number-field.style";
import {
    FormItemNumberFieldClassNameContract,
    FormItemNumberFieldProps,
} from "./form-item.number-field.props";
import FormItemBase from "./form-item.base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemNumberField extends FormItemBase<
    FormItemNumberFieldProps & ManagedClasses<FormItemNumberFieldClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemNumberField";

    public render(): JSX.Element {
        const value: string = getStringValue(this.props.data, this.props.default);

        return (
            <div className={this.generateClassNames()}>
                <div className={this.props.managedClasses.formItemNumberField_control}>
                    <div
                        className={get(
                            this.props,
                            "managedClasses.formItemNumberField_controlLabelRegion"
                        )}
                    >
                        <label
                            className={
                                this.props.managedClasses.formItemNumberField_controlLabel
                            }
                            htmlFor={this.props.dataLocation}
                        >
                            {this.props.label}
                        </label>
                        {this.renderBadge(
                            get(this.props, "managedClasses.formItemNumberField_badge")
                        )}
                    </div>
                    <input
                        className={
                            this.props.managedClasses.formItemNumberField_controlInput
                        }
                        id={this.props.dataLocation}
                        type="number"
                        value={value}
                        name={`number${value}`}
                        onChange={this.handleChange}
                        min={this.props.min}
                        max={this.props.max}
                        step={this.props.step}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className={this.props.managedClasses.formItemNumberField_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.formItemNumberField_softRemoveInput
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

    private generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.formItemNumberField");

        if (this.props.disabled) {
            classes += ` ${get(
                this.props,
                "managedClasses.formItemNumberField__disabled"
            )}`;
        }

        return classes;
    }
}

export default manageJss(styles)(FormItemNumberField);
