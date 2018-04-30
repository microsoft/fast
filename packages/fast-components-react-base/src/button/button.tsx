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
        disabled: void 0,
        href: void 0,
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
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
        return super.generateClassNames(get(this.props, "managedClasses.button"));
    }

    /**
     * Stores HTML tag for use in render
     */
    private renderDisabledAttribute(): object {
        if (this.props.disabled === true) {
            return this.tag === ButtonHTMLTags.a ? {"aria-disabled": true} : {"disabled": true};
        }
    }

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return typeof this.props.href === "string" ? ButtonHTMLTags.a : ButtonHTMLTags.button;
    }
}

export default Button;
export * from "./button.props";
export { IButtonClassNameContract };
