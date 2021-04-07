import { customElement } from "@microsoft/fast-element";
import { Skeleton, SkeletonTemplate as template } from "@microsoft/fast-foundation";
import { SkeletonStyles as styles } from "./skeleton.styles";

/**
 * The FAST Skeleton Element. Implements {@link @microsoft/fast-foundation#Skeleton},
 * {@link @microsoft/fast-foundation#SkeletonTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-skeleton\>
 */
export const FASTSkeleton = Skeleton.compose({
    baseName: "skeleton",
    template,
    styles,
});

/**
 * Styles for Skeleton
 * @public
 */
export const SkeletonStyles = styles;
