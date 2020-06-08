import { customElement } from "@microsoft/fast-element";
import { Carousel, CarouselTemplate as template } from "@microsoft/fast-foundation";
import { CarouselStyles as styles } from "./carousel.styles";

/**
 * The FAST Carousel Element. Implements {@link @microsoft/fast-foundation#Carousel},
 * {@link @microsoft/fast-foundation#CarouselTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-carousel\>
 */
@customElement({
    name: "fast-carousel",
    template,
    styles,
})
export class FASTCarousel extends Carousel {}
