import * as React from "react";
<<<<<<< HEAD
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IButtonProps } from "./Button.props";
=======
import Foundation from "../foundation";
import { IButtonProps, ButtonHTMLTags } from "./Button.props";
>>>>>>> update(button): update button to support html button or anchor configuration
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";

interface IButtonManagedClasses {
    button: string;
}

<<<<<<< HEAD
/* tslint:disable-next-line */
class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>,  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
    protected handledProps: HandledProps<IButtonProps & IInjectedProps<IButtonManagedClasses>> = {
        managedClasses: void 0
    };

    public render(): JSX.Element {
=======
class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>, {}> {
    /**
     * Default props
     */
    public static defaultProps: Partial<IButtonProps & IInjectedProps<IButtonManagedClasses>> = {
        managedClasses: void(0),
        tag: void(0)
    };

    /**
     * Stores HTML tag for use in render
     */
    private tag: string;

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        this.tag = this.generateHTMLTag();

>>>>>>> update(button): update button to support html button or anchor configuration
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
