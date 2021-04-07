import { TooltipTemplate as template, Tooltip } from "@microsoft/fast-foundation";
import { TooltipStyles as styles } from "./tooltip.styles";

/**
 * The FAST Tooltip Custom Element. Implements {@link @microsoft/fast-foundation#Tooltip},
 * {@link @microsoft/fast-foundation#createTooltipTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-tooltip\>
 */
export const FASTTooltip = Tooltip.compose({
    baseName: "tooltip",
    template,
    styles,
});
