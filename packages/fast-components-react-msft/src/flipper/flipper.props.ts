import * as React from "react";
import { IButtonHandledProps } from "@microsoft/fast-components-react-base";
import { IFlipperClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";

export enum FlipperDirection {
    next = "next",
    previous = "previous"
}

export interface IFlipperHandledProps extends IButtonHandledProps {
    /**
     * The flag to expose the flipper to screen readers
     */
    direction?: FlipperDirection;

    /**
     * The flag to expose the flipper to screen readers
     */
    visible?: boolean;

    /**
     * The aria label text to be read by screen readers when the flipper visible to screen readers
     */
    label?: string;
}

export interface IFlipperUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IFlipperManagedClasses extends IManagedClasses<IFlipperClassNameContract> {}
export type FlipperProps = IFlipperHandledProps & IFlipperUnhandledProps & IFlipperManagedClasses;
