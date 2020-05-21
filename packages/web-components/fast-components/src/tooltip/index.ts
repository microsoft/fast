import { customElement } from "@microsoft/fast-element";
// TODO: Update this pathing once we export anchored region from `fast-foundation`
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
