import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button, ButtonAppearance } from "../button";
import {
    ActionTriggerAppearance,
    ActionTriggerHandledProps,
    ActionTriggerUnhandledProps,
} from "./action-trigger.props";
import { actionTriggerButtonOverrides } from "@microsoft/fast-components-styles-msft";
import { DisplayNamePrefix } from "../utilities";

class ActionTrigger extends Foundation<
    ActionTriggerHandledProps,
    ActionTriggerUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}ActionTrigger`;

    protected handledProps: HandledProps<ActionTriggerHandledProps> = {
        appearance: void 0,
        href: void 0,
        managedClasses: void 0,
        disabled: void 0,
        glyph: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <Button
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                disabled={this.props.disabled}
                href={this.props.href}
                appearance={
                    ButtonAppearance[ActionTriggerAppearance[this.props.appearance]]
                }
                jssStyleSheet={actionTriggerButtonOverrides}
                beforeContent={this.generateGlyph}
            >
                {this.props.children}
            </Button>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.actionTrigger", "");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionTrigger__disabled",
                ""
            )}`;
        }

        if (this.props.appearance) {
            classNames = `${classNames} ${get(
                this.props,
                `managedClasses.actionTrigger__${this.props.appearance}`,
                ""
            )}`;
        }

        return super.generateClassNames(classNames);
    }

    private generateGlyph = (): React.ReactNode => {
        return this.props.glyph(get(this.props, "managedClasses.actionTrigger_glyph"));
    };
}

export default ActionTrigger;
export * from "./action-trigger.props";
