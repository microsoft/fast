import { customElement } from "@microsoft/fast-element";
import { Carousel } from "./carousel";
import { CarouselTemplate as template } from "./carousel.template";
// import { CarouselStyles as styles } from "./carousel.styles";

@customElement({
    name: "fast-carousel",
    template,
    // styles,
})
export class FASTCarousel extends Carousel {}
export * from "./carousel.template";
export * from "./carousel.styles";
export * from "./carousel";
