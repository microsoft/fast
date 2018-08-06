import * as React from "react";
import { IManagedClasses, ITabClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { TabSlot } from "./tabs";

export interface ITabHandledProps {
    /**
     * The slot identifying this component to the Tab component as a tab
     * the string passed must be "tab"
     */
    slot: TabSlot.tab;

    /**
     * The tab content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface ITabManagedClasses extends IManagedClasses<ITabClassNameContract> {}
export interface ITabUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type TabProps = ITabHandledProps & ITabUnhandledProps & ITabManagedClasses;
