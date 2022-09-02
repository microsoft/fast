import type { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { StartEndOptions, TemplateElementDependency } from "../patterns/index.js";

/**
 * View options for the {@link @microsoft/fast-foundation#(FASTHorizontalScroll:class)|FASTHorizontalScroll} component.
 * @public
 */
export const HorizontalScrollView = {
    default: "default",
    mobile: "mobile",
} as const;

/**
 * View option types for the {@link @microsoft/fast-foundation#(FASTHorizontalScroll:class)|FASTHorizontalScroll} component.
 * @public
 */
export type HorizontalScrollView = typeof HorizontalScrollView[keyof typeof HorizontalScrollView];

/**
 * Easing values for the {@link @microsoft/fast-foundation#(FASTHorizontalScroll:class)|FASTHorizontalScroll} component.
 * @public
 */
export const ScrollEasing = {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
} as const;

/**
 * Easing types for the {@link @microsoft/fast-foundation#(FASTHorizontalScroll:class)|FASTHorizontalScroll} component.
 * @public
 */
export type ScrollEasing = typeof ScrollEasing[keyof typeof ScrollEasing];

/**
 * Horizontal scroll configuration options
 * @public
 */
export type HorizontalScrollOptions = StartEndOptions & {
    nextFlipper?: SyntheticViewTemplate | string;
    previousFlipper?: SyntheticViewTemplate | string;
    flipper: TemplateElementDependency;
};
