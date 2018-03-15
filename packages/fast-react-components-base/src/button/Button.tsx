import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IButtonProps, ButtonHTMLTags } from "./Button.props";
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";

interface IButtonManagedClasses {
    button: string;
}

/* tslint:disable-next-line */
class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<IButtonProps & IInjectedProps<IButtonManagedClasses>> = {
        managedClasses: void 0,
        tag: void 0
    };

    protected defaultProps: IButtonProps = {
        tag: ButtonHTMLTags.button
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
export {IButtonProps, IButtonManagedClasses, ButtonHTMLTags};
