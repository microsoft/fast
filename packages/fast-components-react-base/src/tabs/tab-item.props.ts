import * as React from "react";

export interface ITabItemHandledProps {
    /**
     * The unique id for the tab item
     */
    id: string;

    /**
     * The slot identifying this component to the TabItem component as a tab-item
     * the string passed must be "tab-item"
     */
    slot: string;

    /**
     * The tab-item content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface ITabItemUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type TabItemProps = ITabItemHandledProps & ITabItemUnhandledProps;
