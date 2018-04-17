import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button.props";
import { IButtonClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Button HTML tags
 */
export enum ButtonHTMLTags {
    a = "a",
    button = "button"
}

/* tslint:disable-next-line */
class Button extends Foundation<IButtonHandledProps & IManagedClasses<IButtonClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<IButtonHandledProps & IManagedClasses<IButtonClassNameContract>> = {
        children: void 0,
        href: void 0,
        justified: void 0,
        lightweight: void 0,
        managedClasses: void 0,
        outline: void 0,
        primary: void 0
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        if (typeof this.props.href === "string") {
            return ButtonHTMLTags.a;
        } else {
            return ButtonHTMLTags.button;
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </this.tag>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let className: string;

        if (this.props.primary) {
            className = "managedClasses.button_primary";
        } else if (this.props.outline) {
            className = "managedClasses.button_outline";
        } else if (this.props.lightweight) {
            className = "managedClasses.button_lightweight";
        } else if (this.props.justified) {
            className = "managedClasses.button_justified";
        } else {
            className = "managedClasses.button";
        }

        return super.generateClassNames(get(this.props, className));
    }
}

export default Button;
export * from "./button.props";
export { IButtonClassNameContract };
