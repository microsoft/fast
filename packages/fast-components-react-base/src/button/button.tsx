import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import { ButtonHandledProps, ButtonProps, ButtonUnhandledProps } from "./button.props";

/**
 * Button HTML tags
 */
export enum ButtonHTMLTags {
    a = "a",
    button = "button",
}

class Button extends Foundation<ButtonHandledProps, ButtonUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Button`;
    public static defaultProps: Partial<ButtonProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<ButtonHandledProps> = {
        disabled: void 0,
        href: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                href={this.props.href || null}
                {...this.renderDisabledAttribute()}
            >
                {this.props.children}
            </this.tag>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            button,
            button__disabled,
        }: ButtonClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(button, [button__disabled, this.props.disabled])
        );
    }

    /**
     * Stores HTML tag for use in render
     */
    private renderDisabledAttribute(): object {
        if (this.props.disabled === true) {
            return this.tag === ButtonHTMLTags.a
                ? { "aria-disabled": true }
                : { disabled: true };
        }
    }

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): any {
        return typeof this.props.href === "string"
            ? ButtonHTMLTags.a
            : ButtonHTMLTags.button;
    }
}

export default Button;
export * from "./button.props";
export { ButtonClassNameContract };
