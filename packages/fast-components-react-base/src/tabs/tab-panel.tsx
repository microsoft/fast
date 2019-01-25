import * as React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ManagedClasses,
    TabPanelClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import {
    TabPanelHandledProps,
    TabPanelManagedClasses,
    TabPanelProps,
    TabPanelUnhandledProps,
} from "./tab-panel.props";

class TabPanel extends Foundation<TabPanelHandledProps, TabPanelUnhandledProps, {}> {
    public static defaultProps: Partial<TabPanelProps> = {
        active: false,
    };

    public static displayName: string = "TabPanel";

    protected handledProps: HandledProps<TabPanelHandledProps> = {
        managedClasses: void 0,
        active: void 0,
        slot: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div
                {...this.unhandledProps()}
                role="tabpanel"
                aria-hidden={!this.props.active}
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
        return this.props.active
            ? super.generateClassNames(get(this.props, "managedClasses.tabPanel"))
            : super.generateClassNames(
                  `${get(this.props, "managedClasses.tabPanel", "")} ${get(
                      this.props,
                      "managedClasses.tabPanel__hidden",
                      ""
                  )}`
              );
    }
}

export default TabPanel;
export * from "./tab-panel.props";
export { TabPanelClassNameContract };
