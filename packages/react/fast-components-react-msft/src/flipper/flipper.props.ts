import React from "react";
import {
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    FlipperClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum FlipperDirection {
    next = "next",
    previous = "previous",
}

export type FlipperManagedClasses = ManagedClasses<FlipperClassNameContract>;
export interface FlipperHandledProps
    extends Omit<ButtonHandledProps, keyof ButtonManagedClasses>,
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

export type FlipperUnhandledProps = ButtonUnhandledProps;
export type FlipperProps = FlipperHandledProps & FlipperUnhandledProps;
