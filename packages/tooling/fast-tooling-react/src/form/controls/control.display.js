import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.display.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
/**
 * Form control definition
 */
class DisplayControl extends React.Component {
    constructor() {
        super(...arguments);
        /**
         * Dummy onChange handler
         *
         * Form elements will not validate against read-only form items
         * therefore a value and onChange handler must still be supplied
         * even if there is no intention to update the value.
         */
        this.handleInputChange = () => {};
    }
    render() {
        return (
            <input
                className={classNames(
                    this.props.managedClasses.displayControl,
                    [
                        this.props.managedClasses.displayControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.displayControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                type={"text"}
                ref={this.props.elementRef}
                onBlur={this.props.updateValidity}
                onFocus={this.props.reportValidity}
                value={this.getDisplayValue(this.props.value)}
                onChange={this.handleInputChange}
                disabled={this.props.disabled}
                required={this.props.required}
            />
        );
    }
    getDisplayValue(data) {
        const typeofData = typeof data;
        const typeofDefault = typeof this.props.default;
        if (typeofData === "undefined" && typeofDefault !== "undefined") {
            if (typeofDefault === "string") {
                return this.props.default;
            }
            return JSON.stringify(this.props.default, null, 2);
        }
        switch (typeofData) {
            case "string":
                return data;
            default:
                return JSON.stringify(data, null, 2);
        }
    }
}
DisplayControl.displayName = "DisplayControl";
DisplayControl.defaultProps = {
    managedClasses: {},
};
export { DisplayControl };
export default manageJss(styles)(DisplayControl);
