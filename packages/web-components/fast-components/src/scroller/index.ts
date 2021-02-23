import { customElement } from "@microsoft/fast-element";
import {
    Scroller,
    ScrollerStyles as styles,
    ScrollerTemplate as template,
} from "@microsoft/fast-foundation";

/**
 * The FAST Scroller Element. Implements {@link @microsoft/fast-foundation#Scroller},
 * {@link @microsoft/fast-foundation#ScrollerTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-scroller\>
 */
@customElement({
    name: "fast-scroller",
    template,
    styles,
})
export class FASTScroller extends Scroller {}
