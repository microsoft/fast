import { customElement } from "@microsoft/fast-element";
import {
    BaseProgress,
    ProgressRingTemplate as template,
} from "@microsoft/fast-foundation";
import { ProgressRingStyles as styles } from "./progress-ring.styles";

@customElement({
    name: "fast-progress-ring",
    template,
    styles,
})
export class FASTProgressRing extends BaseProgress {}
