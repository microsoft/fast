import React from "react";

/**
 * Friendly names for the indexes of backgrounds
 * on the neutral ramp. These values are designed
 * to work with the default neutral ramp provided by the DesignSystem
 */
export enum LightModeBackgrounds {
    L1 = 0,
    L1Alt = 2,
    L2 = 4,
    L3 = 6,
    L4 = 8,
}

export enum DarkModeBackgrounds {
    L1 = 0,
    L1Alt = 2,
    L2 = 4,
    L3 = 6,
    L4 = 8,
}

export interface BackgroundHandledProps {
    tag: keyof React.ReactHTML;
}

const foo: BackgroundHandledProps = {
    tag: "dialog",
};
