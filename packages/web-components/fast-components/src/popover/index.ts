import { customElement } from "@microsoft/fast-element";
import { createPopoverTemplate, Popover } from "@microsoft/fast-foundation";
import { FASTAnchoredRegion } from "../anchored-region";
import { PopoverStyles as styles } from "./popover.styles";

// prevent tree shaking
FASTAnchoredRegion;

/**
 * The FAST Popover Custom Element. Implements {@link @microsoft/fast-foundation#Popover},
 * {@link @microsoft/fast-foundation#PopoverTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-popover\>
 */
@customElement({
    name: "fast-popover",
    template: createPopoverTemplate("fast"),
    styles,
})
export class FASTPopover extends Popover {}
