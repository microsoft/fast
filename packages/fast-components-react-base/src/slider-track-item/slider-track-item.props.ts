import React from "react";
import {
    ManagedClasses,
    SliderTrackItemClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface SliderTrackItemManagedClasses
    extends ManagedClasses<SliderTrackItemClassNameContract> {}
export interface SliderTrackItemUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export enum SliderTrackItemAnchor {
    selectedRangeMin = "selectedRangeMin",
    selectedRangeMax = "selectedRangeMax",
    totalRangeMin = "totalRangeMin",
    totalRangeMax = "totalRangeMax",
}

export interface SliderTrackItemHandledProps extends SliderTrackItemManagedClasses {
    /**
     * The children of the slider track item
     */
    children?: React.ReactNode;

    /**
     * The slider value to align the max edge of the component with
     */
    maxValuePositionBinding?: number | SliderTrackItemAnchor;

    /**
     * The slider value to align the min edge of the component with
     */
    minValuePositionBinding?: number | SliderTrackItemAnchor;
}

export type SliderTrackItemProps = SliderTrackItemHandledProps &
    SliderTrackItemUnhandledProps;
