import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { ButtonHTMLTags, IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button.props";
import { IButtonClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/* tslint:disable-next-line */
class Button extends Foundation<IButtonHandledProps & IManagedClasses<IButtonClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<IButtonHandledProps & IManagedClasses<IButtonClassNameContract>> = {
        managedClasses: void 0,
        tag: void 0
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return this.generateHTMLTag();
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
        return super.generateClassNames(this.props.managedClasses.button);
    }

    /**
     * Creates tags for rendering based on href
     */
    private generateHTMLTag(): string {
        switch (this.props.tag) {
            case ButtonHTMLTags.a:
                return "a";
            case ButtonHTMLTags.button:
            default:
                return "button";
        }
    }
}

export default Button;
export * from "./button.props";
export { IButtonClassNameContract };
