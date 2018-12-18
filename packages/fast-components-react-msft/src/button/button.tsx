import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ButtonAppearance,
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "./button.props";
import { Button as BaseButton } from "@microsoft/fast-components-react-base";

/**
 * Button slot options
 */
export enum ButtonSlot {
    before = "before",
    after = "after",
}

class Button extends Foundation<ButtonHandledProps, ButtonUnhandledProps, {}> {
    public static displayName: string = "Button";

    protected handledProps: HandledProps<ButtonHandledProps> = {
        appearance: void 0,
        beforeContent: void 0,
        afterContent: void 0,
        disabled: void 0,
        href: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <BaseButton
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                managedClasses={this.props.managedClasses}
                href={this.props.href}
                disabled={this.props.disabled}
            >
                {this.withSlot(ButtonSlot.before)}
                {this.generateBeforeContent()}
                <span className={get(this.props, "managedClasses.button_contentRegion")}>
                    {this.withoutSlot([ButtonSlot.before, ButtonSlot.after])}
                </span>
                {this.withSlot(ButtonSlot.after)}
                {this.generateAfterContent()}
            </BaseButton>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const className: string = this.props.appearance
            ? get(
                  this.props,
                  `managedClasses.button__${ButtonAppearance[this.props.appearance]}`
              )
            : "";

        return super.generateClassNames(className);
    }

    private generateBeforeContent(): React.ReactNode {
        if (typeof this.props.beforeContent === "function") {
            return this.props.beforeContent(
                get(this.props, "managedClasses.button_beforeContent", "")
            );
        }
    }

    private generateAfterContent(): React.ReactNode {
        if (typeof this.props.afterContent === "function") {
            return this.props.afterContent(
                get(this.props, "managedClasses.button_afterContent", "")
            );
        }
    }
}

export default Button;
export * from "./button.props";
