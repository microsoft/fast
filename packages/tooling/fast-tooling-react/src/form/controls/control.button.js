import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.button.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
/**
 * Form control definition
 * @extends React.Component
 */
class ButtonControl extends React.Component {
    constructor() {
        super(...arguments);
        this.handleButtonClick = () => {
            return e => {
                e.preventDefault();
                this.props.onChange({ value: null });
            };
        };
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
            <React.Fragment>
                <button
                    className={classNames(
                        this.props.managedClasses.buttonControl,
                        [
                            this.props.managedClasses.buttonControl__disabled,
                            this.props.disabled,
                        ],
                        [
                            this.props.managedClasses.buttonControl__default,
                            isDefault(this.props.value, this.props.default),
                        ]
                    )}
                    ref={this.props.elementRef}
                    onBlur={this.props.updateValidity}
                    onFocus={this.props.reportValidity}
                    onClick={this.handleButtonClick()}
                    disabled={this.props.disabled}
                >
                    Set to null
                </button>
                <input
                    id={this.props.dataLocation}
                    hidden={true}
                    value={this.props.value || ""}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                    required={this.props.required}
                />
            </React.Fragment>
        );
    }
}
ButtonControl.displayName = "ButtonControl";
ButtonControl.defaultProps = {
    managedClasses: {},
};
export { ButtonControl };
export default manageJss(styles)(ButtonControl);
