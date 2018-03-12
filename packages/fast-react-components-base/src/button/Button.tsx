import * as React from "react";
import Foundation from "../foundation";
import { IButtonProps } from "./Button.props";
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";

interface IButtonManagedClasses {
    button: string;
}

class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <button
            	{...this.unhandledProps()}
            	className={this.props.managedClasses.button}
            >
            	{this.props.children}
            </button>
        );
    }
}

export default Button;
export { IButtonProps, IButtonManagedClasses };
