import { customElement } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";
import { ProgressTemplate as template } from "./progress.template";
import { ProgressStyles as styles } from "./progress.styles";

@customElement({
    name: "fast-progress",
    template,
    styles,
})
export class FASTProgress extends BaseProgress {}
export * from "./progress.template";
export * from "./progress.styles";
