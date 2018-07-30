import * as React from "react";
import { IHorizontalOverflowClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IHorizontalOverflowHandledProps {
    /**
     * The horizontal overflow content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The duration the scroll movement should last
     */
    scrollDuration?: number;
}

export interface IHorizontalOverflowUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IHorizontalOverflowManagedClasses extends IManagedClasses<IHorizontalOverflowClassNameContract> {}
export type HorizontalOverflowProps = IHorizontalOverflowHandledProps
    & IHorizontalOverflowUnhandledProps
    & IHorizontalOverflowManagedClasses;
