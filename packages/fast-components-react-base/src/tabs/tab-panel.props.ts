import * as React from "react";

export interface ITabPanelHandledProps {
    /**
     * The tab-panel content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface ITabPanelUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type TabPanelProps = ITabPanelHandledProps & ITabPanelUnhandledProps;
