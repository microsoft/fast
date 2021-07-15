import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.number-field.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
/**
 * Form control definition
 */
class NumberFieldControl extends React.Component {
    constructor() {
        super(...arguments);
        this.hasFocus = false;
        this.handleFocus = callback => {
            return () => {
                this.hasFocus = true;
                if (callback) callback();
            };
        };
        this.handleBlur = callback => {
            return () => {
                this.hasFocus = false;
                if (callback) callback();
                this.forceUpdate();
            };
        };
        this.handleChange = () => {
            return e => {
                const input = !e.target.value ? "" : e.target.value.replace(/\s/g, "");
                const value = parseInt(input, 10);
                if (!isNaN(value)) {
                    this.props.onChange({ value });
                } else if (input.length === 0) {
                    this.props.onChange({ value: undefined });
                }
            };
        };
    }
    /**
     * Renders the component
     */
    render() {
        return (
            <input
                className={classNames(
                    this.props.managedClasses.numberFieldControl,
                    [
                        this.props.managedClasses.numberFieldControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.numberFieldControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                id={this.props.dataLocation}
                type={"number"}
                value={this.getValue(this.props.value)}
                name={this.props.dataLocation}
                onChange={this.handleChange()}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                disabled={this.props.disabled}
                ref={this.props.elementRef}
                onBlur={this.handleBlur(this.props.updateValidity)}
                onFocus={this.handleFocus(this.props.reportValidity)}
                required={this.props.required}
            />
        );
    }
    getValue(value) {
        return typeof value === "number"
            ? value
            : typeof this.props.default !== "undefined" && !this.hasFocus
            ? this.props.default
            : "";
    }
}
NumberFieldControl.displayName = "NumberFieldControl";
NumberFieldControl.defaultProps = {
    managedClasses: {},
};
export { NumberFieldControl };
export default manageJss(styles)(NumberFieldControl);
