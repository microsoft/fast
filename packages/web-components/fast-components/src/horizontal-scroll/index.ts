import { customElement } from "@microsoft/fast-element";
import {
    HorizontalScroll,
    HorizontalScrollTemplate as template,
} from "@microsoft/fast-foundation";
import {
    ActionsStyles,
    HorizontalScrollStyles as styles,
} from "./horizontal-scroll.styles";

/**
 * The FAST HorizontalScroll Element. Implements {@link @microsoft/fast-foundation#HorizontalScroll},
 * {@link @microsoft/fast-foundation#HorizontalScrollTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: `<fast-horizontal-scroll>`
 */
@customElement({
    name: "fast-horizontal-scroll",
    template,
    styles,
})
export class FASTHorizontalScroll extends HorizontalScroll {
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

export { ActionsStyles, HorizontalScrollStyles } from "./horizontal-scroll.styles";
