import React from "react";
import {
    ManagedClasses,
    TabPanelClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { TabsSlot } from "./tabs";

export interface TabPanelManagedClasses
    extends ManagedClasses<TabPanelClassNameContract> {}
export interface TabPanelUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface TabPanelHandledProps extends TabPanelManagedClasses {
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

export type TabPanelProps = TabPanelHandledProps & TabPanelUnhandledProps;
