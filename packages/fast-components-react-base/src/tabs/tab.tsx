import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import { ITabHandledProps, ITabUnhandledProps } from "./tab.props";

class Tab extends Foundation<ITabHandledProps, ITabUnhandledProps, {}> {
    protected handledProps: HandledProps<ITabHandledProps> = {
        children: void 0,
        slot: void 0
    };

    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default Tab;
export * from "./tab.props";
