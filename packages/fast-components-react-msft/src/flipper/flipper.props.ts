import * as React from "react";
import { IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "@microsoft/fast-components-react-base";
import { IFlipperClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { Subtract } from "utility-types";

export enum FlipperDirection {
    next = "next",
    previous = "previous"
}

export interface IFlipperManagedClasses extends IManagedClasses<IFlipperClassNameContract> {}
export interface IFlipperHandledProps extends Subtract<IButtonHandledProps, IButtonManagedClasses>, IFlipperManagedClasses {
    /**
     * The flipper direction
     */
    direction?: FlipperDirection;

    /**
     * The flag to expose the flipper to screen readers
     */
    visibleToAssistiveTechnologies?: boolean;

    /**
     * The aria label text to be read by screen readers when the flipper visible to screen readers
     */
    label?: string;
}

/* tslint:disable-next-line:no-empty-interface */
export interface IFlipperUnhandledProps extends IButtonUnhandledProps {}
export type FlipperProps = IFlipperHandledProps & IFlipperUnhandledProps;
