import { customElement } from "@microsoft/fast-element";
import { BaseProgress, ProgressTemplate as template } from "@microsoft/fast-components";
import { ProgressStyles as styles } from "./progress.styles";

@customElement({
    name: "msft-progress",
    template,
    styles,
})
export class MSFTProgress extends BaseProgress {}
