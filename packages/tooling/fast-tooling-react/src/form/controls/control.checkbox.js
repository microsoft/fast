import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.checkbox.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
/**
 * Form control definition
 * @extends React.Component
 */
class CheckboxControl extends React.Component {
    constructor() {
        super(...arguments);
        this.handleChange = () => {
            return e => {
                this.props.onChange({ value: e.target.checked });
            };
        };
    }
    render() {
        const value =
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
                    ref={this.props.elementRef}
                    onFocus={this.props.reportValidity}
                    onBlur={this.props.updateValidity}
                />
                <span className={this.props.managedClasses.checkboxControl_checkmark} />
            </div>
        );
    }
}
CheckboxControl.displayName = "CheckboxControl";
CheckboxControl.defaultProps = {
    managedClasses: {},
};
export { CheckboxControl };
export default manageJss(styles)(CheckboxControl);
