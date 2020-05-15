import { customElement } from "@microsoft/fast-element";
import { BaseProgress, ProgressTemplate as template } from "@microsoft/fast-foundation";
import { ProgressStyles as styles } from "./progress.styles.js";

@customElement({
    name: "fast-progress",
    template,
    styles,
})
export class FASTProgress extends BaseProgress {}
