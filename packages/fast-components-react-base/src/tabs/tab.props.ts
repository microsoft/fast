import * as React from "react";
import { IManagedClasses, ITabClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { TabsSlot } from "./tabs";

export interface ITabManagedClasses extends IManagedClasses<ITabClassNameContract> {}
export interface ITabUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ITabHandledProps extends ITabManagedClasses {
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

export type TabProps = ITabHandledProps & ITabUnhandledProps;
