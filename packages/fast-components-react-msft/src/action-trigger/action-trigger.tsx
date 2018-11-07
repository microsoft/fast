import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button, ButtonAppearance } from "../button";
import {
    ActionTriggerAppearance,
    ActionTriggerHandledProps,
    ActionTriggerUnhandledProps,
} from "./action-trigger.props";
import { get } from "lodash-es";
import { glyphArrowright } from "@microsoft/fast-glyphs-msft";
import { actionTriggerButtonOverrides } from "@microsoft/fast-components-styles-msft";

class ActionTrigger extends Foundation<
    ActionTriggerHandledProps,
    ActionTriggerUnhandledProps,
    {}
> {
    public static displayName: string = "ActionTrigger";

    protected handledProps: HandledProps<ActionTriggerHandledProps> = {
        appearance: void 0,
        href: void 0,
        managedClasses: void 0,
        disabled: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
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
            >
                {this.props.children}
                <div
                    slot="after"
                    className={get(this.props, "managedClasses.actionTrigger_glyph")}
                    dangerouslySetInnerHTML={{ __html: glyphArrowright }}
                />
            </Button>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.actionTrigger");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionTrigger__disabled"
            )}`;
        }

        switch (this.props.appearance) {
            case ActionTriggerAppearance.primary:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.actionTrigger__primary"
                )}`;
                break;
            case ActionTriggerAppearance.lightweight:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.actionTrigger__lightweight"
                )}`;
                break;
            case ActionTriggerAppearance.justified:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.actionTrigger__justified"
                )}`;
                break;
        }

        return super.generateClassNames(classNames);
    }
}

export default ActionTrigger;
export * from "./action-trigger.props";
