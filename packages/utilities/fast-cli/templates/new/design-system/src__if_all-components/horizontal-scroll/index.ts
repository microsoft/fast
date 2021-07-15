import { html } from "@microsoft/fast-element";
import {
    HorizontalScroll as FoundationHorizontalScroll,
    HorizontalScrollOptions,
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
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.view !== "mobile") {
            this.$fastController.addStyles(ActionsStyles);
        }
    }
}

/**
 * A function that returns a CHorizontal Scrollregistration for configuring the component with a DesignSystem.
 * Implements Horizontal Scroll
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-horizontal-scroll\>
 */
export const /* @echo namespace */HorizontalScroll = HorizontalScroll.compose<HorizontalScrollOptions>({
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
