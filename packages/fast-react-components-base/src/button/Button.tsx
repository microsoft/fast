import * as React from "react";
import Foundation from "../foundation";
import IButtonProps from "./Button.props";

class Button extends Foundation<any, any> {
    public render(): JSX.Element {
        return (
            <button>{ this.props.children }</button>
        );
    }
}

export default Button;
export { IButtonProps };
