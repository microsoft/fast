import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button as BaseButton, ButtonProps } from "@microsoft/fast-components-react-base";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    ButtonAppearance,
    ButtonHandledProps,
    ButtonUnhandledProps,
} from "./button.props";
import { ButtonClassNameContract } from ".";

/**
 * Button slot options
 */
export enum ButtonSlot {
    before = "before",
    after = "after",
}

class Button extends Foundation<ButtonHandledProps, ButtonUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Button`;

    public static defaultProps: ButtonProps = {
        managedClasses: {},
    };

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
        const managedClasses: ButtonClassNameContract = this.props.managedClasses;

        return (
            <BaseButton
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                managedClasses={managedClasses}
                href={this.props.href}
                disabled={this.props.disabled}
            >
                {this.withSlot(ButtonSlot.before)}
                {this.generateBeforeContent()}
                <span className={classNames(managedClasses.button_contentRegion)}>
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
        return super.generateClassNames(
            classNames([
                this.props.managedClasses[
                    `button__${ButtonAppearance[this.props.appearance]}`
                ],
                typeof this.props.appearance === "string",
            ])
        );
    }

    private generateBeforeContent(): React.ReactNode {
        if (typeof this.props.beforeContent === "function") {
            return this.props.beforeContent(
                classNames(this.props.managedClasses.button_beforeContent)
            );
        }
    }

    private generateAfterContent(): React.ReactNode {
        if (typeof this.props.afterContent === "function") {
            return this.props.afterContent(
                classNames(this.props.managedClasses.button_afterContent)
            );
        }
    }
}

export default Button;
export * from "./button.props";
