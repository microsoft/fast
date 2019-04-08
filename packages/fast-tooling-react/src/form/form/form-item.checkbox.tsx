import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import styles from "./form-item.checkbox.style";
import {
    FormItemCheckboxClassNameContract,
    FormItemCheckboxProps,
} from "./form-item.checkbox.props";
import FormItemBase from "./form-item.base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemCheckbox extends FormItemBase<
    FormItemCheckboxProps & ManagedClasses<FormItemCheckboxClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemCheckbox";

    public render(): JSX.Element {
        const value: boolean =
            typeof this.props.data === "boolean"
                ? this.props.data
                : this.props.default || false;

        return (
            <div className={this.generateClassNames()}>
                <div
                    className={get(this.props, "managedClasses.formItemCheckbox_control")}
                >
                    <input
                        className={this.props.managedClasses.formItemCheckbox_input}
                        id={this.props.dataLocation}
                        type="checkbox"
                        value={value.toString()}
                        onChange={this.handleChange}
                        checked={value}
                        disabled={this.props.disabled}
                        ref={this.inputRef}
                        onFocus={this.reportValidity}
                        onBlur={this.updateValidity}
                    />
                    <span />
                    <label
                        className={this.props.managedClasses.formItemCheckbox_label}
                        htmlFor={this.props.dataLocation}
                    >
                        {this.props.label}
                    </label>
                    {this.renderDefaultValueIndicator(
                        get(
                            this.props,
                            "managedClasses.formItemCheckbox_defaultValueIndicator"
                        )
                    )}
                    {this.renderBadge(
                        get(this.props, "managedClasses.formItemCheckbox_badge")
                    )}
                    <div
                        className={this.props.managedClasses.formItemCheckbox_softRemove}
                    >
                        {this.renderSoftRemove(
                            this.props.managedClasses.formItemCheckbox_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.formItemCheckbox_invalidMessage")
                )}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = this.props.managedClasses.formItemCheckbox;

        if (this.props.disabled) {
            classNames = `${classNames} ${
                this.props.managedClasses.formItemCheckbox__disabled
            }`;
        }

        return classNames;
    }

    /**
     * Handles the onChange of the input element
     */
    private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        return this.props.onChange(this.props.dataLocation, event.target.checked);
    };
}

export { FormItemCheckbox };
export default manageJss(styles)(FormItemCheckbox);
