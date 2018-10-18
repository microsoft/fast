import * as React from "react";
import {
    ManagedClasses,
    TabClassNameContract
} from "@microsoft/fast-components-class-name-contracts-base";
import { TabsSlot } from "./tabs";

export interface TabManagedClasses extends ManagedClasses<TabClassNameContract> {}
export interface TabUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface TabHandledProps extends TabManagedClasses {
    /**
     * The slot identifying this component to the Tab component as a tab
     * the default string passed must be "tab"
     */
    slot: TabsSlot.tab | string;

    /**
     * The tab active state
     */
    active?: boolean;

    /**
     * The tab content
     */
    children?: React.ReactNode;
}

export type TabProps = TabHandledProps & TabUnhandledProps;
