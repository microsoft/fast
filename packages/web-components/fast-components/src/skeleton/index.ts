import { customElement } from "@microsoft/fast-element";
import { Skeleton, SkeletonTemplate as template } from "@microsoft/fast-foundation";
import { SkeletonStyles as styles } from "./skeleton.styles";

@customElement({
  name: "fluent-skeleton",
  template,
  styles
})
export class FluentSkeleton extends Skeleton {};

export const SkeletonStyles = styles;