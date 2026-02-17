import type { StaticallyComposableHTML, ValuesOf } from "../utilities/index.js";
import type { StartEndOptions } from "../patterns/index.js";
import type { FASTHorizontalScroll } from "./horizontal-scroll.js";

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
export type HorizontalScrollView = ValuesOf<typeof HorizontalScrollView>;

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
export type ScrollEasing = ValuesOf<typeof ScrollEasing>;

/**
 * Horizontal scroll configuration options
 * @public
 */
export type HorizontalScrollOptions = StartEndOptions<FASTHorizontalScroll> & {
    nextFlipper?: StaticallyComposableHTML<FASTHorizontalScroll>;
    previousFlipper?: StaticallyComposableHTML<FASTHorizontalScroll>;
};
