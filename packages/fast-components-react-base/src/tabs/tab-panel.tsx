import * as React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IManagedClasses, ITabPanelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ITabPanelHandledProps, ITabPanelManagedClasses, ITabPanelUnhandledProps } from "./tab-panel.props";

class TabPanel extends Foundation<ITabPanelHandledProps & ITabPanelManagedClasses, ITabPanelUnhandledProps, {}> {
    protected handledProps: HandledProps<ITabPanelHandledProps & IManagedClasses<ITabPanelClassNameContract>> = {
        managedClasses: void 0,
        slot: void 0
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div
                {...this.unhandledProps()}
                role="tabpanel"
                className={this.generateClassNames()}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        return this.unhandledProps()["aria-hidden"]
            ? super.generateClassNames(
                `${get(this.props, "managedClasses.tabPanel")} ${get(this.props, "managedClasses.tabPanel__hidden")}`
              )
            : super.generateClassNames(get(this.props, "managedClasses.tabPanel"));
    }
}

export default TabPanel;
export * from "./tab-panel.props";
