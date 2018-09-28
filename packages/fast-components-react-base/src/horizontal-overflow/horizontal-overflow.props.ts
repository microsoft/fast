import * as React from "react";
import { IHorizontalOverflowClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Scroll interface for consumers
 * 'start' is when the horizontal overflow scroll is all the way left in LTR (all the way right in RTL)
 * 'end' is when the horizontal overflow scroll is all the right in LTR (all the way left in RTL)
 */
export interface IScrollChange {
    start: boolean;
    end: boolean;
}

export interface IHorizontalOverflowUnhandledProps extends React.AllHTMLAttributes<HTMLDivElement> {}
export interface IHorizontalOverflowManagedClasses extends IManagedClasses<IHorizontalOverflowClassNameContract> {}
export interface IHorizontalOverflowHandledProps extends IHorizontalOverflowManagedClasses {
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
    onScrollChange?: (scrollObject: IScrollChange) => void;
}

export type HorizontalOverflowProps = IHorizontalOverflowHandledProps & IHorizontalOverflowUnhandledProps;
