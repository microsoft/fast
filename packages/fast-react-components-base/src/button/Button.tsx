import * as React from "react";
import Foundation from "../foundation";
import { IButtonProps } from "./Button.props";
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";

interface IButtonManagedClasses {
    host: string;
}

class Button extends Foundation<IButtonProps & IInjectedProps<IButtonManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <button className={this.props.managedClasses.host}>{this.props.children}</button>
        );
    }
}

export default Button;
export { IButtonProps, IButtonManagedClasses };
