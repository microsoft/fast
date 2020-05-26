import { customElement } from "@microsoft/fast-element";
import {
    Tooltip,
    TooltipTemplate as template,
} from "@microsoft/fast-foundation";
import { TooltipStyles as styles } from "./tooltip.styles";

@customElement({
    name: "fast-tooltip",
    template,
    styles,
})
export class FASTTooltip extends Tooltip {}
