import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation from "../foundation";
import { IButtonProps } from "./Button.props";
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";

interface IButtonManagedClasses {
    button: string;
}

// class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>,  JSX.IntrinsicElements, {}> {
class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>,  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> | React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, {}> {
// class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>,  React.HTMLProps<HTMLButtonElement>, {}> {
    protected handledPropsObject = {
        managedClasses: true,
    }

    protected handledProps = {
        managedClasses: void 0
    } 


    public render(): JSX.Element {
        return (
            <button className={this.props.managedClasses.button}>{this.props.children}</button>
        );
    }
}


<Button type={"submit"}  managedClasses={{button: ""}} name="name" />
export default Button;
export { IButtonProps, IButtonManagedClasses };
