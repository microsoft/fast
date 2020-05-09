import { customElement } from "@microsoft/fast-element";
import {
    BaseProgress,
    ProgressRingTemplate as template,
} from "@microsoft/fast-components";
import { ProgressRingStyles as styles } from "./progress-ring.styles";

@customElement({
    name: "msft-progress-ring",
    template,
    styles,
})
export class MSFTProgressRing extends BaseProgress {}
