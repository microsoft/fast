import { Skeleton, skeletonTemplate as template } from "@microsoft/fast-foundation";
import { skeletonStyles as styles } from "./skeleton.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Skeleton} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#skeletonTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-skeleton\>
 */
export const fastSkeleton = Skeleton.compose({
    baseName: "skeleton",
    template,
    styles,
});

/**
 * Styles for Skeleton
 * @public
 */
export const skeletonStyles = styles;

/**
 * Base class for Skeleton
 * @public
 */
export { Skeleton };
