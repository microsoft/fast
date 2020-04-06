import { customElement } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";
import { ProgressRingTemplate as template } from "./progress-ring.template";
import { ProgressRingStyles as styles } from "./progress-ring.styles";
import { designSystemConsumer } from "../../design-system-consumer";
import {
    accentFillRest,
    neutralFillRest,
    neutralForegroundHint,
} from "../../styles/recipes";

@customElement({
    name: "fast-progress-ring",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [neutralFillRest, accentFillRest, neutralForegroundHint],
})
export class FASTProgressRing extends BaseProgress {}
export * from "./progress-ring.template";
export * from "./progress-ring.styles";
