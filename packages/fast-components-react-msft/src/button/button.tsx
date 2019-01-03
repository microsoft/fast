import * as React from "react";
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
        beforeSlot: void 0,
        afterSlot: void 0,
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
                {this.generateBeforeSlot()}
                <span className={get(this.props, "managedClasses.button_contentRegion")}>
                    {this.withoutSlot([ButtonSlot.before, ButtonSlot.after])}
                </span>
                {this.withSlot(ButtonSlot.after)}
                {this.generateAfterSlot()}
            </BaseButton>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        switch (this.props.appearance) {
            case ButtonAppearance.primary:
                return super.generateClassNames(
                    get(this.props, "managedClasses.button__primary")
                );
            case ButtonAppearance.outline:
                return super.generateClassNames(
                    get(this.props, "managedClasses.button__outline")
                );
            case ButtonAppearance.lightweight:
                return super.generateClassNames(
                    get(this.props, "managedClasses.button__lightweight")
                );
            case ButtonAppearance.justified:
                return super.generateClassNames(
                    get(this.props, "managedClasses.button__justified")
                );
            default:
                return super.generateClassNames();
        }
    }

    private generateBeforeSlot(): React.ReactNode {
        if (typeof this.props.beforeSlot === "function") {
            return this.props.beforeSlot(
                get(this.props, "managedClasses.managedClasses.button_beforeSlot", "")
            );
        }
    }

    private generateAfterSlot(): React.ReactNode {
        if (typeof this.props.afterSlot === "function") {
            return this.props.afterSlot(
                get(this.props, "managedClasses.managedClasses.button_afterSlot", "")
            );
        }
    }
}

export default Button;
export * from "./button.props";
