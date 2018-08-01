import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import { ITabPanelHandledProps, ITabPanelUnhandledProps } from "./tab-panel.props";

class TabPanel extends Foundation<ITabPanelHandledProps, ITabPanelUnhandledProps, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default TabPanel;
export * from "./tab-panel.props";
