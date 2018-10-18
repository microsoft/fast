import * as React from "react";
import {
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    FlipperClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { Subtract } from "utility-types";

export enum FlipperDirection {
    next = "next",
    previous = "previous",
}

export interface FlipperManagedClasses extends ManagedClasses<FlipperClassNameContract> {}
export interface FlipperHandledProps
    extends Subtract<ButtonHandledProps, ButtonManagedClasses>,
        FlipperManagedClasses {
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
export interface FlipperUnhandledProps extends ButtonUnhandledProps {}
export type FlipperProps = FlipperHandledProps & FlipperUnhandledProps;
