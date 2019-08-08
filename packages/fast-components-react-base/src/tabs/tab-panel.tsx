import { TabPanelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    TabPanelHandledProps,
    TabPanelProps,
    TabPanelUnhandledProps,
} from "./tab-panel.props";

class TabPanel extends Foundation<TabPanelHandledProps, TabPanelUnhandledProps, {}> {
    public static defaultProps: Partial<TabPanelProps> = {
        active: false,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}TabPanel`;

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
        const {
            tabPanel,
            tabPanel__hidden,
        }: TabPanelClassNameContract = this.props.managedClasses;
        return super.generateClassNames(
            classNames(tabPanel, [tabPanel__hidden, !this.props.active])
        );
    }
}

export default TabPanel;
export * from "./tab-panel.props";
