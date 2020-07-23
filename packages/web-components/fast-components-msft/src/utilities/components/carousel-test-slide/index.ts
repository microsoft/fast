import { customElement } from "@microsoft/fast-element";
import {
    CarouselTestSlide,
    CarouselTestSlideTemplate as template,
} from "@microsoft/fast-foundation";
import { CarouselTestSlideStyles as styles } from "./carousel-test-slide.styles";

@customElement({
    name: "fast-carousel-test-slide",
    template,
    styles,
})
export class FASTCarouselTestSlide extends CarouselTestSlide {}
