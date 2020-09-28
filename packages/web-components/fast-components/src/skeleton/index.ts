import { customElement } from "@microsoft/fast-element";
import { Skeleton, SkeletonTemplate as template } from "@microsoft/fast-foundation";
import { SkeletonStyles as styles } from "./skeleton.styles";

@customElement({
    name: "fast-skeleton",
    template,
    styles,
})
export class FASTSkeleton extends Skeleton {}

export const SkeletonStyles = styles;
