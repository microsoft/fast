import { customElement } from "@microsoft/fast-element";
import {
    HorizontalScroll as FoundationHorizontalScroll,
    HorizontalScrollTemplate as template,
} from "@microsoft/fast-foundation";
import {
    ActionsStyles,
    HorizontalScrollStyles as styles,
} from "./horizontal-scroll.styles";

/**
 * @internal
 */
export class HorizontalScroll extends FoundationHorizontalScroll {
    /**
     * @public
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.view !== "mobile") {
            this.$fastController.addStyles(ActionsStyles);
        }
    }
}

/**
 * The FAST HorizontalScroll Element. Implements {@link @microsoft/fast-foundation#HorizontalScroll},
 * {@link @microsoft/fast-foundation#HorizontalScrollTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-horizontal-scroll\>
 */
export const FASTHorizontalScroll = HorizontalScroll.compose({
    baseName: "horizontal-scroll",
    template,
    styles,
});
