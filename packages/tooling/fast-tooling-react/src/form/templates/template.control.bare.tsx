import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ControlTemplateUtilities from "./template.control.utilities";
import style, {
    BareControlTemplateClassNameContract,
} from "./template.control.bare.style";
import { BareControlTemplateProps } from "./template.control.bare.props";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Control template definition
 */
class BareControlTemplate extends ControlTemplateUtilities<
    BareControlTemplateProps & ManagedClasses<BareControlTemplateClassNameContract>,
    {}
> {
    public static defaultProps: Partial<
        BareControlTemplateProps & ManagedClasses<BareControlTemplateClassNameContract>
    > = {
        managedClasses: {},
    };

    public render(): React.ReactNode {
        const {
            bareControlTemplate,
            bareControlTemplate__disabled,
        }: BareControlTemplateClassNameContract = this.props.managedClasses;

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

export { BareControlTemplate };
export default manageJss(style)(BareControlTemplate);
