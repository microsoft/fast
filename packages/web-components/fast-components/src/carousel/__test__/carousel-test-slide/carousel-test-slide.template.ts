import { html, repeat } from "@microsoft/fast-element";
import { CarouselTestSlide } from "./carousel-test-slide";

/**
 * The template for the {@link @microsoft/fast-foundation#CarouselTestSlide} testing component.
 * @public
 */
export const CarouselTestSlideTemplate = html<CarouselTestSlide>`
    <div>
        <span class="outer-span">
            <span class="inner-span">
                <slot></slot>
            </span>
            <img
                src="https://placehold.it/1300x600/${x =>
                    x.even ? "3E3E3E/171717" : ""}"
                alt="Place Holder Image"
            />
        </span>
    </div>
`;
