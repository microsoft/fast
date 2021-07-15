import React from "react";
import styles from "./control.theme.style";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames } from "@microsoft/fast-web-utilities";
var Theme;
(function (Theme) {
    Theme["Light"] = "light";
    Theme["Dark"] = "dark";
})(Theme || (Theme = {}));
/**
 * Custom form control definition
 */
class ThemeControl extends React.Component {
    constructor() {
        super(...arguments);
        this.onChange = value => {
            this.props.onChange({ value });
        };
    }
    render() {
        return (
            <div
                className={classNames(this.props.managedClasses.themeControl, [
                    this.props.managedClasses.themeControl__disabled,
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Theme.Light)}
                {this.renderInput(Theme.Dark)}
            </div>
        );
    }
    isChecked(theme) {
        return (
            this.props.value === theme ||
            (typeof this.props.value === "undefined" && this.props.default === theme)
        );
    }
    getInputClassName(theme) {
        return theme === Theme.Dark
            ? this.props.managedClasses.themeControl_input__dark
            : this.props.managedClasses.themeControl_input__light;
    }
    getThemeLabel(theme) {
        switch (theme) {
            case Theme.Dark:
                return this.props.strings.themeDarkLabel;
            case Theme.Light:
                return this.props.strings.themeLightLabel;
        }
    }
    renderInput(theme) {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option = this.props.options.find(item => {
                return item === theme;
            });
            if (typeof option !== "undefined") {
                return (
                    <input
                        className={classNames(
                            this.props.managedClasses.themeControl_input,
                            this.getInputClassName(theme)
                        )}
                        id={this.props.dataLocation}
                        type={"radio"}
                        value={theme}
                        name={this.props.dataLocation}
                        aria-label={this.getThemeLabel(theme)}
                        onChange={this.onChange.bind(this, theme)}
                        checked={this.isChecked(theme)}
                        disabled={this.props.disabled}
                    />
                );
            }
        }
    }
}
ThemeControl.displayName = "ThemeControl";
ThemeControl.defaultProps = {
    managedClasses: {},
};
export { ThemeControl };
export default manageJss(styles)(ThemeControl);
