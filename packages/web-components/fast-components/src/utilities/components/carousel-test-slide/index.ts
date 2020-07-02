import { customElement } from "@microsoft/fast-element";
import {
    CarouselSlide,
    CarouselSlideTemplate as template,
} from "@microsoft/fast-foundation";
import { CarouselSlideStyles as styles } from "./carousel-slide.styles";

@customElement({
    name: "fast-carousel-test-slide",
    template,
    styles,
})
export class FASTCarouselTestSlide extends CarouselSlide {}
