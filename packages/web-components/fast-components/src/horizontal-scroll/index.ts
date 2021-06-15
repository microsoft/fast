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
 * The FAST HorizontalScroll Element. Implements {@link @microsoft/fast-foundation#HorizontalScroll},
 * {@link @microsoft/fast-foundation#horizontalScrollTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-horizontal-scroll\>
 */
export const fastHorizontalScroll = HorizontalScroll.compose<HorizontalScrollOptions>({
    baseName: "horizontal-scroll",
    template,
    styles,
    nextFlipper: html`
        <fast-flipper
            @click="${x => x.scrollToNext()}"
            aria-hidden="false"
        ></fast-flipper>
    `,
    previousFlipper: html`
        <fast-flipper
            @click="${x => x.scrollToPrevious()}"
            direction="previous"
            aria-hidden="false"
        ></fast-flipper>
    `,
});
