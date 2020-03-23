import { customElement } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";
import { LinearProgressTemplate as template } from "./linear-progress.template";
import { LinearProgressStyles as styles } from "./linear-progress.styles";

@customElement({
    name: "fast-progress",
    template,
    styles,
})
export class FASTProgress extends BaseProgress {}
export * from "./linear-progress.template";
export * from "./linear-progress.styles";
