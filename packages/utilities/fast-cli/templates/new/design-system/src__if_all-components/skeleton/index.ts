import { Skeleton, skeletonTemplate as template } from "@microsoft/fast-foundation";
import { skeletonStyles as styles } from "./skeleton.styles";

/**
 * A function that returns a Skeleton registration for configuring the component with a DesignSystem.
 * Implements Skeleton
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-skeleton\>
 */
export const /* @echo namespace */Skeleton = Skeleton.compose({
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
