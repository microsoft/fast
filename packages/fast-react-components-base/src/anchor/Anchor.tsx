import * as React from "react";
import Foundation from "../foundation";
import { IAnchorProps } from "./Anchor.props";
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";

interface IAnchorManagedClasses {
    anchor: string;
}

class Anchor extends Foundation<IAnchorProps & IInjectedProps<IAnchorManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <a
            	{...this.unhandledProps()}
            	className={this.props.managedClasses.anchor}
            >
            	{this.props.children}
            </a>
        );
    }
}

export default Anchor;
export { IAnchorProps, IAnchorManagedClasses };
