import * as React from "react";
import { IHorizontalOverflowClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { Direction } from "@microsoft/fast-application-utilities";

export type onScrollToStart = () => void;
export type onScrollToEnd = () => void;

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
     * Callback for on scroll start
     */
    onScrollToStart?: onScrollToStart;

    /**
     * Callback for on scroll end
     */
    onScrollToEnd?: onScrollToEnd;

    /**
     * Option to remove previous/next buttons when scroll reaches beginning or end of container
     */
    autoRemoveClickElements?: boolean;

    /**
     * Direction in LTR/RTL
     */
    direction?: Direction;
}

export interface IHorizontalOverflowUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IHorizontalOverflowManagedClasses extends IManagedClasses<IHorizontalOverflowClassNameContract> {}
export type HorizontalOverflowProps = IHorizontalOverflowHandledProps
    & IHorizontalOverflowUnhandledProps
    & IHorizontalOverflowManagedClasses;
