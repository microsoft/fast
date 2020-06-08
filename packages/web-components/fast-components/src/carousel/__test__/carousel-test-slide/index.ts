import { customElement } from "@microsoft/fast-element";
import { CarouselTestSlide } from "./carousel-test-slide";
import { CarouselTestSlideTemplate as template } from "./carousel-test-slide.template";
import { CarouselTestSlideStyles as styles } from "./carousel-test-slide.styles";

@customElement({
    name: "fast-carousel-test-slide",
    template,
    styles,
})
export class FASTCarouselTestSlide extends CarouselTestSlide {}
