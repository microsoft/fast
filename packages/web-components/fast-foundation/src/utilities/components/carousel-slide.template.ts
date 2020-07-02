import { html, repeat } from "@microsoft/fast-element";
import { CarouselSlide } from "./carousel-slide";

/**
 * The template for the {@link @microsoft/fast-foundation#CarouselSlide} testing component.
 * @public
 */
export const CarouselSlideTemplate = html<CarouselSlide>`
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
