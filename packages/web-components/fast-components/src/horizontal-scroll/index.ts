import { html } from "@microsoft/fast-element";
import {
    Flipper,
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
 * A function that returns a {@link @microsoft/fast-foundation#HorizontalScroll} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#horizontalScrollTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-horizontal-scroll\>
 */
export const fastHorizontalScroll = HorizontalScroll.compose<HorizontalScrollOptions>({
    baseName: "horizontal-scroll",
    template,
    styles,
    nextFlipper: context => html`
        <${context.tagFor(Flipper)}
            @click="${x => x.scrollToNext()}"
            aria-hidden="${x => x.flippersHiddenFromAT}"
        ></${context.tagFor(Flipper)}>
    `,
    previousFlipper: context => html`
        <${context.tagFor(Flipper)}
            @click="${x => x.scrollToPrevious()}"
            direction="previous"
            aria-hidden="${x => x.flippersHiddenFromAT}"
        ></${context.tagFor(Flipper)}>
    `,
});
