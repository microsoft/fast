import { html } from "@microsoft/fast-element";
import {
    HorizontalScroll as FoundationHorizontalScroll,
    horizontalScrollTemplate as template,
} from "@microsoft/fast-foundation";
import {
    ActionsStyles,
    horizontalScrollStyles as styles,
} from "./horizontal-scroll.styles";
/**
 * @internal
 */
export class HorizontalScroll extends FoundationHorizontalScroll {
    /**
     * @public
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.view !== "mobile") {
            this.$fastController.addStyles(ActionsStyles);
        }
    }
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#HorizontalScroll} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#horizontalScrollTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-horizontal-scroll\>
 */
export const fastHorizontalScroll = HorizontalScroll.compose({
    baseName: "horizontal-scroll",
    template,
    styles,
    nextFlipper: html`
        <fast-flipper
            @click="${x => x.scrollToNext()}"
            aria-hidden="${x => x.flippersHiddenFromAT}"
        ></fast-flipper>
    `,
    previousFlipper: html`
        <fast-flipper
            @click="${x => x.scrollToPrevious()}"
            direction="previous"
            aria-hidden="${x => x.flippersHiddenFromAT}"
        ></fast-flipper>
    `,
});
