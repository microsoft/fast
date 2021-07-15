import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.select.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
/**
 * Form control definition
 */
class SelectControl extends React.Component {
    constructor() {
        super(...arguments);
        this.handleChange = () => {
            return e => {
                const value = this.props.options.find(option => {
                    return typeof option === "string"
                        ? option === e.target.value
                        : JSON.stringify(option) === e.target.value;
                });
                this.props.onChange({ value });
            };
        };
    }
    /**
     * Renders the component
     */
    render() {
        const {
            selectControl,
            selectControl__disabled,
            selectControl__default,
            selectControl_input,
        } = this.props.managedClasses;
        return (
            <span
                className={classNames(
                    selectControl,
                    [selectControl__disabled, this.props.disabled],
                    [
                        selectControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
            >
                <select
                    className={selectControl_input}
                    onChange={this.handleChange()}
                    value={this.getValue()}
                    disabled={this.props.disabled}
                    ref={this.props.elementRef}
                    onBlur={this.props.updateValidity}
                    onFocus={this.props.reportValidity}
                    required={this.props.required}
                >
                    {this.renderOptions()}
                </select>
            </span>
        );
    }
    /**
     * Stringify the select value
     */
    stringify(value) {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }
    getValue() {
        return typeof this.props.value !== "undefined"
            ? this.props.value
            : typeof this.props.default !== "undefined"
            ? this.props.default
            : "";
    }
    /**
     * Renders the selects option elements
     */
    renderOptions() {
        return (this.props.options || []).map((item, index) => {
            return (
                <option key={index} value={item}>
                    {typeof item === "string" || typeof item === "number"
                        ? item
                        : this.stringify(item)}
                </option>
            );
        });
    }
}
SelectControl.displayName = "SelectControl";
SelectControl.defaultProps = {
    managedClasses: {},
};
export { SelectControl };
export default manageJss(styles)(SelectControl);
