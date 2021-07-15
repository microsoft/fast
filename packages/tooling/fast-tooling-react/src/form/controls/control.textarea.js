import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.textarea.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
/**
 * Form control definition
 */
class TextareaControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleFocus = e => {
            this.props.reportValidity();
            this.setState({
                isFocused: true,
            });
        };
        this.handleBlur = e => {
            this.props.updateValidity();
            this.setState({
                isFocused: false,
            });
        };
        this.handleChange = () => {
            return e => {
                this.props.onChange({ value: e.target.value });
            };
        };
        this.state = {
            isFocused: false,
        };
    }
    render() {
        return (
            <textarea
                className={classNames(
                    this.props.managedClasses.textareaControl,
                    [
                        this.props.managedClasses.textareaControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.textareaControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                id={this.props.dataLocation}
                name={this.props.dataLocation}
                rows={this.getRows()}
                value={this.getValue()}
                onChange={this.handleChange()}
                disabled={this.props.disabled}
                ref={this.props.elementRef}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                required={this.props.required}
            />
        );
    }
    getRows() {
        return typeof this.props.rows === "number" ? this.props.rows : 3;
    }
    getValue() {
        // Return undefined to allow typing anywhere other than the end of the string
        // when the typing is occuring in the textarea
        if (this.state.isFocused) {
            return;
        }
        return typeof this.props.value === "string"
            ? this.props.value
            : typeof this.props.default === "string"
            ? this.props.default
            : "";
    }
}
TextareaControl.displayName = "TextareaControl";
TextareaControl.defaultProps = {
    managedClasses: {},
};
export { TextareaControl };
export default manageJss(styles)(TextareaControl);
