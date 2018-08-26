import * as React from "react";
import { IHorizontalOverflowClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export type onScrollChange = () => void;

export interface IHorizontalOverflowHandledProps {
    /**
     * The horizontal overflow content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The duration the scroll movement should last
     */
    scrollDuration?: number;

    /**
     * Callback for on scroll change
     */
    onScrollChange?: onScrollChange;
}

export interface IHorizontalOverflowUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IHorizontalOverflowManagedClasses extends IManagedClasses<IHorizontalOverflowClassNameContract> {}
export type HorizontalOverflowProps = IHorizontalOverflowHandledProps
    & IHorizontalOverflowUnhandledProps
    & IHorizontalOverflowManagedClasses;
