import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ControlTemplateUtilities from "./template.control.utilities";
import style, {
    SingleLineControlTemplateClassNameContract,
} from "./template.control.single-line.style";
import { SingleLineControlTemplateProps } from "./template.control.single-line.props";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Control template definition
 */
class SingleLineControlTemplate extends ControlTemplateUtilities<
    SingleLineControlTemplateProps &
        ManagedClasses<SingleLineControlTemplateClassNameContract>,
    {}
> {
    public static defaultProps: Partial<
        SingleLineControlTemplateProps &
            ManagedClasses<SingleLineControlTemplateClassNameContract>
    > = {
        softRemove: true,
        managedClasses: {},
    };

    public render(): React.ReactNode {
        const {
            singleLineControlTemplate,
            singleLineControlTemplate__disabled,
            singleLineControlTemplate_badge,
            singleLineControlTemplate_control,
            singleLineControlTemplate_defaultValueIndicator,
            singleLineControlTemplate_invalidMessage,
            singleLineControlTemplate_label,
            singleLineControlTemplate_softRemove,
            singleLineControlTemplate_softRemoveInput,
        }: SingleLineControlTemplateClassNameContract = this.props.managedClasses;

        return (
            <div
                className={classNames(singleLineControlTemplate, [
                    singleLineControlTemplate__disabled,
                    this.props.disabled,
                ])}
            >
                <div className={singleLineControlTemplate_control}>
                    {this.props.control(this.getConfig())}
                    <label
                        className={singleLineControlTemplate_label}
                        htmlFor={this.props.dataLocation}
                        title={this.props.labelTooltip}
                    >
                        {this.props.label}
                    </label>
                    {this.renderDefaultValueIndicator(
                        singleLineControlTemplate_defaultValueIndicator
                    )}
                    {this.renderBadge(singleLineControlTemplate_badge)}
                    <div className={singleLineControlTemplate_softRemove}>
                        {this.renderSoftRemove(singleLineControlTemplate_softRemoveInput)}
                    </div>
                </div>
                {this.renderInvalidMessage(singleLineControlTemplate_invalidMessage)}
            </div>
        );
    }
}

export { SingleLineControlTemplate };
export default manageJss(style)(SingleLineControlTemplate);
