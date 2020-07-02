import { FASTElement, attr } from "@microsoft/fast-element";

/**
 * A Carousel Slide Test Component to be used with {@link @microsoft/fast-foundation#(Carousel:class)}
 * @public
 */
export class CarouselSlide extends FASTElement {
    @attr({ mode: "boolean" })
    public even: boolean = false;
}
