import { customElement } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";
import { CircularProgressTemplate as template } from "./circular-progress.template";
import { CircularProgressStyles as styles } from "./circular-progress.styles";

@customElement({
    name: "fast-progress-ring",
    template,
    styles,
})
export class FASTProgressRing extends BaseProgress {}
export * from "./circular-progress.template";
export * from "./circular-progress.styles";
