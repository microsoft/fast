import { customElement } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";
import { ProgressRingTemplate as template } from "./progress-ring.template";
import { ProgressRingStyles as styles } from "./progress-ring.styles";
import { consumer } from "../../design-system-provider/design-system-consumer";
import {
    neutralfillrest,
    accentfillrest,
    neutralforegroundhint,
} from "../../styles/recipes";

@customElement({
    name: "fast-progress-ring",
    template,
    styles,
})
@consumer({
    recipes: [neutralfillrest, accentfillrest, neutralforegroundhint],
})
export class FASTProgressRing extends BaseProgress {}
export * from "./progress-ring.template";
export * from "./progress-ring.styles";
