import { customElement } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";
import { designSystemConsumer } from "../../design-system-consumer";
import {
    accentFillRest,
    neutralFillRest,
    neutralForegroundHint,
} from "../../styles/recipes";
import { ProgressTemplate as template } from "./progress.template";
import { ProgressStyles as styles } from "./progress.styles";

@customElement({
    name: "fast-progress",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [neutralFillRest, accentFillRest, neutralForegroundHint],
})
export class FASTProgress extends BaseProgress {}
export * from "./progress.template";
export * from "./progress.styles";
