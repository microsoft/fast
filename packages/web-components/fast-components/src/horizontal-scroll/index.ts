import { customElement } from "@microsoft/fast-element";
import {
    HorizontalScroll,
    HorizontalScrollStyles as styles,
    HorizontalScrollTemplate as template,
} from "@microsoft/fast-foundation";

/**
 * The FAST HorizontalScroll Element. Implements {@link @microsoft/fast-foundation#HorizontalScroll},
 * {@link @microsoft/fast-foundation#HorizontalScrollTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-horizontal-scroll\>
 */
@customElement({
    name: "fast-horizontal-scroll",
    template,
    styles,
})
export class FASTHorizontalScroll extends HorizontalScroll {}
