import * as React from "react";

export interface ITabHandledProps {
    /**
     * The tab content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface ITabUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type TabProps = ITabHandledProps & ITabUnhandledProps;
