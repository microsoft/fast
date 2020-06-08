import { customElement } from "@microsoft/fast-element";
import { Carousel, createCarouselTemplate } from "@microsoft/fast-foundation";
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
    template: createCarouselTemplate("fast"),
    styles,
})
export class FASTCarousel extends Carousel {}
