import * as React from "react";

export interface ITabHandledProps {
    /**
     * The slot identifying this component to the Tab component as a tab
     * the string passed must be "tab"
     */
    slot: string;

    /**
     * The tab content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface ITabUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type TabProps = ITabHandledProps & ITabUnhandledProps;
