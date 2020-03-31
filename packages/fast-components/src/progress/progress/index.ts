import { customElement } from "@microsoft/fast-element";
import { BaseProgress } from "../base-progress";
import { ProgressTemplate as template } from "./progress.template";
import { ProgressStyles as styles } from "./progress.styles";
import { consumer } from "../../design-system-provider/design-system-consumer";
import {
    neutralfillrest,
    accentfillrest,
    neutralforegroundhint,
} from "../../styles/recipes";

@customElement({
    name: "fast-progress",
    template,
    styles,
})
@consumer({
    recipes: [neutralfillrest, accentfillrest, neutralforegroundhint],
})
export class FASTProgress extends BaseProgress {}
export * from "./progress.template";
export * from "./progress.styles";
