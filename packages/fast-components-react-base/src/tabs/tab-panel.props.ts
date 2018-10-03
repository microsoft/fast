import * as React from "react";
import { IManagedClasses, ITabPanelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { TabsSlot } from "./tabs";

export interface ITabPanelManagedClasses extends IManagedClasses<ITabPanelClassNameContract> {}
export interface ITabPanelUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ITabPanelHandledProps extends ITabPanelManagedClasses {
    /**
     * The slot identifying this component to the TabPanel component as a tab-panel
     * the default string passed must be "tab-panel"
     */
    slot: TabsSlot.tabPanel | string;

    /**
     * The tab-panel active state
     */
    active?: boolean;

    /**
     * The tab-panel content
     */
    children?: React.ReactNode;
}

export type TabPanelProps = ITabPanelHandledProps & ITabPanelUnhandledProps;
