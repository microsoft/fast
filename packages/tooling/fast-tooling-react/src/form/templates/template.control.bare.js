import React from "react";
import ControlTemplateUtilities from "./template.control.utilities";
import style from "./template.control.bare.style";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames } from "@microsoft/fast-web-utilities";
/**
 * Control template definition
 */
class BareControlTemplate extends ControlTemplateUtilities {
    render() {
        const {
            bareControlTemplate,
            bareControlTemplate__disabled,
        } = this.props.managedClasses;
        return (
            <div
                className={classNames(bareControlTemplate, [
                    bareControlTemplate__disabled,
                    this.props.disabled,
                ])}
            >
                {this.props.control(this.getConfig())}
            </div>
        );
    }
}
BareControlTemplate.defaultProps = {
    managedClasses: {},
};
export { BareControlTemplate };
export default manageJss(style)(BareControlTemplate);
