import { customElement } from "@microsoft/fast-element";
import {
    CarouselSlide,
    CarouselSlideTemplate as template,
} from "@microsoft/fast-foundation";
import { CarouselSlideStyles as styles } from "./carousel-slide.styles";

/**
 * The FAST CarouselSlide Custom Element. Implements {@link @microsoft/fast-foundation#CarouselSlide},
 * {@link @microsoft/fast-foundation#CarouselSlideTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-carousel-slide\>
 */
@customElement({
    name: "fast-carousel-slide",
    template,
    styles,
})
export class FASTCarouselSlide extends CarouselSlide {}
