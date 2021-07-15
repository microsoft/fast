import React from "react";
import ControlTemplateUtilities from "./template.control.utilities";
import style from "./template.control.standard.style";
import { ControlContext } from "./types";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames } from "@microsoft/fast-web-utilities";
/**
 * Control template definition
 */
class StandardControlTemplate extends ControlTemplateUtilities {
    render() {
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
        } = this.props.managedClasses;
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
    renderControl(context) {
        return context === this.props.context
            ? this.props.control(this.getConfig())
            : null;
    }
}
StandardControlTemplate.defaultProps = {
    context: ControlContext.default,
    managedClasses: {},
};
export { StandardControlTemplate };
export default manageJss(style)(StandardControlTemplate);
