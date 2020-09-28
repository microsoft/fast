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
@customElement({
    name: "fast-skeleton",
    template,
    styles,
})
export class FASTSkeleton extends Skeleton {}

/**
 * Styles for Skeleton
 * @public
 */
export const SkeletonStyles = styles;
