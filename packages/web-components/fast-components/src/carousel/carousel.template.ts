import { html } from "@microsoft/fast-element";
import { when } from "@microsoft/fast-element";
import { ref } from "@microsoft/fast-element/dist/directives/";
import { Carousel } from "./carousel";

export const CarouselTemplate = html<Carousel>`
<div
    class="carousel"
    aria-roledescription="carousel"
    tabindex="-1"
    @click="${x => x.handleClick}"
>
    <slot>Slide content / items go here</slot>
    <slot name="play-toggle"> TODO: NEED DEFAULT PLAY TOGGLE </slot>
    <slot name="next-button">
        <fast-flipper direction={FlipperDirection.next}></fast-flipper>
    </slot>
    <div
        class="carousel-items"
        aria-live="off"
    >
    </div>
    <slot name="previous-button">
        <fast-flipper direction={FlipperDirection.previous}></fast-flipper>
    </slot>
    <slot name="tab-list">
        <div role="tab-list" class="tab-list" aria-label="A carousel of items">
            <div tabindex="0" role="tab" class="tab-list-tab"></div>
            <div tabindex="-1" role="tab" class="tab-list-tab"></div>
            <div tabindex="-1" role="tab" class="tab-list-tab"></div>
            <div tabindex="-1" role="tab" class="tab-list-tab"></div>
            <div tabindex="-1" role="tab" class="tab-list-tab"></div>
        </div>
    </slot>
</div>
`;
