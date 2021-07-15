import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.text-align.style";
import { classNames } from "@microsoft/fast-web-utilities";
var Direction;
(function (Direction) {
    Direction["Left"] = "left";
    Direction["Center"] = "center";
    Direction["Right"] = "right";
    Direction["Justify"] = "justify";
})(Direction || (Direction = {}));
/**
 * Custom form control definition
 */
class TextAlignControl extends React.Component {
    constructor() {
        super(...arguments);
        this.onChange = value => {
            this.props.onChange({ value });
        };
    }
    render() {
        return (
            <div
                className={classNames(this.props.managedClasses.textAlignControl, [
                    this.props.managedClasses.textAlignControl__disabled,
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Direction.Left)}
                {this.renderInput(Direction.Center)}
                {this.renderInput(Direction.Right)}
                {this.renderInput(Direction.Justify)}
            </div>
        );
    }
    isChecked(direction) {
        return (
            this.props.value === direction ||
            (typeof this.props.value === "undefined" && this.props.default === direction)
        );
    }
    getInputClassName(direction) {
        switch (direction) {
            case Direction.Left:
                return this.props.managedClasses.textAlignControl_input__left;
            case Direction.Center:
                return this.props.managedClasses.textAlignControl_input__center;
            case Direction.Right:
                return this.props.managedClasses.textAlignControl_input__right;
            case Direction.Justify:
                return this.props.managedClasses.textAlignControl_input__justify;
        }
    }
    getDirectionLabel(direction) {
        switch (direction) {
            case Direction.Left:
                return this.props.strings.textAlignLeftLabel;
            case Direction.Center:
                return this.props.strings.textAlignCenterLabel;
            case Direction.Right:
                return this.props.strings.textAlignRightLabel;
            case Direction.Justify:
                return this.props.strings.textAlignJustifyLabel;
        }
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
                                this.props.managedClasses.textAlignControl_input,
                                this.getInputClassName(direction)
                            )}
                            id={this.props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={this.props.dataLocation}
                            aria-label={this.getDirectionLabel(direction)}
                            onChange={this.onChange.bind(this, direction)}
                            checked={this.isChecked(direction)}
                            disabled={this.props.disabled}
                        />
                    </span>
                );
            }
        }
    }
}
TextAlignControl.displayName = "TextAlignControl";
TextAlignControl.defaultProps = {
    managedClasses: {},
};
export { TextAlignControl };
export default manageJss(styles)(TextAlignControl);
