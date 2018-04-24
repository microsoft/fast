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
        justified: void 0,
        lightweight: void 0,
        managedClasses: void 0,
        outline: void 0,
        primary: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                {...this.renderDisabled()}
            >
                {this.generateInnerContent()}
            </this.tag>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classLocation: string;

        if (this.props.primary) {
            classLocation = "managedClasses.button_primary";
        } else if (this.props.outline) {
            classLocation = "managedClasses.button_outline";
        } else if (this.props.lightweight) {
            classLocation = "managedClasses.button_lightweight";
        } else if (this.props.justified) {
            classLocation = "managedClasses.button_justified";
        } else {
            classLocation = "managedClasses.button";
        }

        return super.generateClassNames(get(this.props, classLocation));
    }

    /**
     * Stores HTML tag for use in render
     */
    private renderDisabled(): any {
        if (this.props.disabled) {
            if (this.tag === ButtonHTMLTags.a) {
                return {"aria-disabled": true};
            } else {
                return {"disabled": true};
            }
        }
    }

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

    private generateInnerContent(): React.ReactElement<HTMLSpanElement> | (React.ReactNode | React.ReactNode[]) {
        if (this.props.lightweight || this.props.justified) {
            return <span className={get(this.props, "managedClasses.button_span")}>{this.props.children}</span>;
        } else {
            return this.props.children;
        }
    }
}

export default Button;
export * from "./button.props";
export { IButtonClassNameContract };
