import React from "react";

/**
 * Friendly names for the indexes of light mode backgrounds
 * on the neutral ramp. These values are designed to work with
 * the default neutral ramp provided by the DesignSystem
 */
export enum LightModeBackgrounds {
    L1 = 0,
    L1Alt = 2,
    L2 = 4,
    L3 = 6,
    L4 = 8,
}

/**
 * Friendly names for the indexes of dark mode backgrounds
 * on the neutral ramp. These values are designed to work with
 * the default neutral ramp provided by the DesignSystem
 */
export enum DarkModeBackgrounds {
    L1 = 49,
    L1Alt = 49, // This is intentionally the same as L1
    L2 = 51,
    L3 = 53,
    L4 = 55,
}

export interface BackgroundHandledProps {
    /**
     * The HTML element to create
     */
    tag: keyof React.ReactHTML;

    /**
     * The value of the background to set. When set to a number, the value will be
     * treated as an index on the neutral ramp. When the value is a string,
     * it will be treated as a color string and applied directly
     */
    value: number | string | LightModeBackgrounds | DarkModeBackgrounds;
}

export interface BackgroundUnhandledProps extends React.HTMLAttributes<HTMLElement> {}

export type BackgroundProps = BackgroundHandledProps & BackgroundUnhandledProps;
