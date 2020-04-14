import { ActionTriggerClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { actionTriggerButtonOverrides } from "@microsoft/fast-components-styles-msft";
import { classNames } from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";
import React from "react";
import { Button, ButtonAppearance } from "../button";
import { DisplayNamePrefix } from "../utilities";
import {
    ActionTriggerAppearance,
    ActionTriggerHandledProps,
    ActionTriggerProps,
    ActionTriggerUnhandledProps,
} from "./action-trigger.props";

class ActionTrigger extends Foundation<
    ActionTriggerHandledProps,
    ActionTriggerUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}ActionTrigger`;

    public static defaultProps: Partial<ActionTriggerProps> = {
        managedClasses: {},
    };

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
        const {
            actionTrigger,
            actionTrigger__disabled,
            actionTrigger__hasGlyphAndContent,
        }: ActionTriggerClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                actionTrigger,
                [actionTrigger__disabled, this.props.disabled],
                [
                    this.props.managedClasses[`actionTrigger__${this.props.appearance}`],
                    typeof this.props.appearance === "string",
                ],
                [actionTrigger__hasGlyphAndContent, this.hasGlyphAndContent()]
            )
        );
    }

    private generateGlyph = (): React.ReactNode => {
        return this.props.glyph(
            classNames(this.props.managedClasses.actionTrigger_glyph)
        );
    };

    /**
     * Checks to see if action trigger is displaying both glyph and content or not
     */
    private hasGlyphAndContent(): boolean {
        return !isNil(this.props.glyph) && !isNil(this.props.children);
    }
}

export default ActionTrigger;
export * from "./action-trigger.props";
