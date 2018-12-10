import * as React from "react";
import {
    ManagedClasses,
    TabsClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Orientation } from "@microsoft/fast-web-utilities";

export interface TabConfig {
    className: string;
    key: string;
    "aria-controls": string;
    active: boolean;
    onClick: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    tabIndex: number;
}

export interface TabItems {
    tab: (className: string) => React.ReactNode;
    content: (className: string) => React.ReactNode;
    id: string;
}

export interface TabsManagedClasses extends ManagedClasses<TabsClassNameContract> {}
export interface TabsUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface TabsHandledProps extends TabsManagedClasses {
    /**
     * The active tab item id
     */
    activeId?: string;

    /**
     * The tabs content
     */
    children?: React.ReactNode;

    /**
     * The aria-label applied to the tablist for the tab items
     */
    label: string;

    /**
     * The tab update callback which is fired when a tab
     * is clicked or when the focus is switched to it on keyboard action
     */
    onUpdate?: (activeTab: string) => void;

    /**
     * The orientation for the tablist
     */
    orientation?: Orientation;

    /**
     * A string to use for the slot property for tab item children
     */
    tabItemSlot?: string;

    /**
     * A string to use for the slot property for tab panel children
     */
    tabPanelSlot?: string;

    /**
     * A string to use for the slot property for tab children
     */
    tabSlot?: string;

    /**
     * The tabs' tab item
     */
    tabItems?: TabItems[];
}

export type TabsProps = TabsHandledProps & TabsUnhandledProps;
