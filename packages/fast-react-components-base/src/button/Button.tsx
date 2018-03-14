import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IButtonProps } from "./Button.props";
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";

interface IButtonManagedClasses {
    button: string;
}

/* tslint:disable-next-line */
class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>,  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
    protected handledProps: HandledProps<IButtonProps & IInjectedProps<IButtonManagedClasses>> = {
        managedClasses: void 0
    };

    public render(): JSX.Element {
        return (
            <button className={this.props.managedClasses.button}>{this.props.children}</button>
        );
    }
}

export default Button;
export { IButtonProps, IButtonManagedClasses };
