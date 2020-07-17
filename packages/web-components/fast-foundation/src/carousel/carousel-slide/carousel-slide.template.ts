import { html } from "@microsoft/fast-element";
import { CarouselSlide } from "./carousel-slide";

/**
 * The template for the {@link @microsoft/fast-foundation#CarouselSlide} component.
 * @public
 */
export const CarouselSlideTemplate = html<CarouselSlide>`
    <template slot="tabpanel" class="slide" role="tabpanel">
        <slot></slot>
    </template>
`;
