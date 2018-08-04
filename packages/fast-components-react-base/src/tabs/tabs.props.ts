import * as React from "react";
import { IManagedClasses, ITabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export enum Orientation {
    horizontal = "horizontal",
    vertical = "vertical"
}

export interface ITabsHandledProps {
    /**
     * The active tab item id
     */
    activeId?: string;

    /**
     * The tabs content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The aria-label applied to the tablist for the tab items
     */
    label: string;

    /**
     * The tab update callback
     */
    onUpdateTab?: (activeTab: string) => void;

    /**
     * The orientation for the tablist
     */
    orientation?: Orientation;
}

export interface ITabsUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ITabsManagedClasses extends IManagedClasses<ITabsClassNameContract> {}
export type TabsProps = ITabsHandledProps & ITabsUnhandledProps & ITabsManagedClasses;
