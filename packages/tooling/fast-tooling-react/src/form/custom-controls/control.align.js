import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.align.style";
import { Alignment } from "./control.align.props";
import { classNames } from "@microsoft/fast-web-utilities";
/**
 * Custom form control definition
 */
class AlignControl extends React.Component {
    render() {
        return (
            <div
                className={classNames(this.props.managedClasses.alignControl, [
                    this.props.managedClasses.alignControl__disabled,
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Alignment.top)}
                {this.renderInput(Alignment.center)}
                {this.renderInput(Alignment.bottom)}
            </div>
        );
    }
    isChecked(direction) {
        return (
            this.props.value === direction ||
            (typeof this.props.value === "undefined" && this.props.default === direction)
        );
    }
    handleChange(value) {
        return () => {
            this.props.onChange({ value });
        };
    }
    renderInput(direction) {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option = this.props.options.find(item => {
                return item === direction;
            });
            if (typeof option !== "undefined") {
                return (
                    <span>
                        <input
                            className={classNames(
                                this.props.managedClasses.alignControl_input,
                                [
                                    this.props.managedClasses.alignControl_input__bottom,
                                    direction === Alignment.bottom,
                                ],
                                [
                                    this.props.managedClasses.alignControl_input__center,
                                    direction === Alignment.center,
                                ],
                                [
                                    this.props.managedClasses.alignControl_input__top,
                                    direction === Alignment.top,
                                ]
                            )}
                            id={this.props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={this.props.dataLocation}
                            aria-label={`${direction} align`}
                            onChange={this.handleChange(direction)}
                            checked={this.isChecked(direction)}
                            disabled={this.props.disabled}
                        />
                    </span>
                );
            }
        }
    }
}
AlignControl.displayName = "AlignControl";
AlignControl.defaultProps = {
    managedClasses: {},
};
export { AlignControl };
export default manageJss(styles)(AlignControl);
