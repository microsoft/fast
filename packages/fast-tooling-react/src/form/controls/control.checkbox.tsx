import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import styles from "./control.checkbox.style";
import {
    CheckboxFormControlClassNameContract,
    CheckboxFormControlProps,
} from "./control.checkbox.props";
import BaseFormControl from "./template.control.abstract";

/**
 * Schema form component definition
 * @extends React.Component
 */
class CheckboxFormControl extends BaseFormControl<
    CheckboxFormControlProps & ManagedClasses<CheckboxFormControlClassNameContract>,
    {}
> {
    public static displayName: string = "CheckboxFormControl";

    public render(): JSX.Element {
        const value: boolean =
            typeof this.props.data === "boolean"
                ? this.props.data
                : this.props.default || false;

        return (
            <div className={this.generateClassNames()}>
                <div
                    className={get(
                        this.props,
                        "managedClasses.checkboxFormControl_control"
                    )}
                >
                    <input
                        className={this.props.managedClasses.checkboxFormControl_input}
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
                        className={this.props.managedClasses.checkboxFormControl_label}
                        htmlFor={this.props.dataLocation}
                    >
                        {this.props.label}
                    </label>
                    {this.renderDefaultValueIndicator(
                        get(
                            this.props,
                            "managedClasses.checkboxFormControl_defaultValueIndicator"
                        )
                    )}
                    {this.renderBadge(
                        get(this.props, "managedClasses.checkboxFormControl_badge")
                    )}
                    <div
                        className={
                            this.props.managedClasses.checkboxFormControl_softRemove
                        }
                    >
                        {this.renderSoftRemove(
                            this.props.managedClasses.checkboxFormControl_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.checkboxFormControl_invalidMessage")
                )}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = this.props.managedClasses.checkboxFormControl;

        if (this.props.disabled) {
            classNames = `${classNames} ${
                this.props.managedClasses.checkboxFormControl__disabled
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

export { CheckboxFormControl };
export default manageJss(styles)(CheckboxFormControl);
