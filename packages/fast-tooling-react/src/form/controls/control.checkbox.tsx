import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { CheckboxControlClassNameContract } from "./control.checkbox.style";
import { CheckboxControlProps } from "./control.checkbox.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";

/**
 * Form control definition
 * @extends React.Component
 */
class CheckboxControl extends React.Component<
    CheckboxControlProps & ManagedClasses<CheckboxControlClassNameContract>,
    {}
> {
    public static displayName: string = "CheckboxControl";

    public static defaultProps: Partial<
        CheckboxControlProps & ManagedClasses<CheckboxControlClassNameContract>
    > = {
        managedClasses: {},
    };

    public render(): JSX.Element {
        const value: boolean =
            typeof this.props.value === "boolean"
                ? this.props.value
                : typeof this.props.default === "boolean"
                    ? this.props.default
                    : false;

        return (
            <div
                className={classNames(
                    this.props.managedClasses.checkboxControl,
                    [
                        this.props.managedClasses.checkboxControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.checkboxControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
            >
                <input
                    className={this.props.managedClasses.checkboxControl_input}
                    id={this.props.dataLocation}
                    type={"checkbox"}
                    value={value.toString()}
                    onChange={this.handleChange()}
                    checked={value}
                    disabled={this.props.disabled}
                    ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                    onFocus={this.props.reportValidity}
                    onBlur={this.props.updateValidity}
                    required={this.props.required}
                />
                <span className={this.props.managedClasses.checkboxControl_checkmark} />
            </div>
        );
    }

    private handleChange = (): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.props.onChange({ value: e.target.checked });
        };
    };
}

export { CheckboxControl };
export default manageJss(styles)(CheckboxControl);
