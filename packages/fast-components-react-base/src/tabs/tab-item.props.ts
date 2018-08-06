import * as React from "react";

export interface ITabItemHandledProps {
    /**
     * The unique id for the tab item
     */
    id: string;

    /**
     * The tab-item content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface ITabItemUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type TabItemProps = ITabItemHandledProps & ITabItemUnhandledProps;
