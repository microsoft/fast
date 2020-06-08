import { customElement } from "@microsoft/fast-element";
import { Carousel, CarouselTemplate as template } from "@microsoft/fast-foundation";
import { CarouselStyles as styles } from "./carousel.styles";

@customElement({
    name: "fast-carousel",
    template,
    styles,
})
export class FASTCarousel extends Carousel {}
