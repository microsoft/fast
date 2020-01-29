import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ControlTemplateUtilities from "./template.control.utilities";
import style, {
    StandardControlTemplateClassNameContract,
} from "./template.control.standard.style";
import { StandardControlTemplateProps } from "./template.control.standard.props";
import { ControlContext } from "./types";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Control template definition
 */
class StandardControlTemplate extends ControlTemplateUtilities<
    StandardControlTemplateProps &
        ManagedClasses<StandardControlTemplateClassNameContract>,
    {}
> {
    public static defaultProps: Partial<
        StandardControlTemplateProps &
            ManagedClasses<StandardControlTemplateClassNameContract>
    > = {
        context: ControlContext.default,
        softRemove: true,
        managedClasses: {},
    };

    public render(): React.ReactNode {
        const {
            standardControlTemplate,
            standardControlTemplate__disabled,
            standardControlTemplate_controlRegion,
            standardControlTemplate_control,
            standardControlTemplate_controlLabelRegion,
            standardControlTemplate_controlLabel,
            standardControlTemplate_constValueIndicator,
            standardControlTemplate_defaultValueIndicator,
            standardControlTemplate_badge,
            standardControlTemplate_softRemove,
            standardControlTemplate_softRemoveInput,
            standardControlTemplate_invalidMessage,
        }: StandardControlTemplateClassNameContract = this.props.managedClasses;

        return (
            <div
                className={classNames(standardControlTemplate, [
                    standardControlTemplate__disabled,
                    this.props.disabled,
                ])}
            >
                <div className={standardControlTemplate_controlRegion}>
                    <div className={standardControlTemplate_control}>
                        <div className={standardControlTemplate_controlLabelRegion}>
                            <label
                                htmlFor={this.props.dataLocation}
                                className={standardControlTemplate_controlLabel}
                                title={this.props.labelTooltip}
                            >
                                {this.props.label}
                            </label>
                            {this.renderConstValueIndicator(
                                standardControlTemplate_constValueIndicator
                            )}
                            {this.renderDefaultValueIndicator(
                                standardControlTemplate_defaultValueIndicator
                            )}
                            {this.renderBadge(standardControlTemplate_badge)}
                        </div>
                        {this.renderControl(ControlContext.default)}
                    </div>
                    <div className={standardControlTemplate_softRemove}>
                        {this.renderSoftRemove(standardControlTemplate_softRemoveInput)}
                    </div>
                </div>
                {this.renderControl(ControlContext.fill)}
                {this.renderInvalidMessage(standardControlTemplate_invalidMessage)}
            </div>
        );
    }

    private renderControl(context: ControlContext): React.ReactNode {
        return context === this.props.context
            ? this.props.control(this.getConfig())
            : null;
    }
}

export { StandardControlTemplate };
export default manageJss(style)(StandardControlTemplate);
