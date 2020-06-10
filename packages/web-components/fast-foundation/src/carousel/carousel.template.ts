import { html, ref, repeat, slotted, children } from "@microsoft/fast-element";
import { Carousel } from "./carousel";
import { FlipperDirection } from "../flipper";

export const CarouselTemplate = html<Carousel>`
    <div
        class="carousel"
        aria-roledescription="carousel"
        tabindex="-1"
        ${ref("carousel")} // TODO: Needed???
    >
        <slot ${slotted("items")}></slot>
        <slot name="play-toggle"></slot>
        <slot name="next-button">
            <fast-flipper direction=${FlipperDirection.next}>
        </slot>
        <slot name="previous-button">
            <fast-flipper direction=${FlipperDirection.previous}>
        </slot>
        <div ${children("tabs")}>${repeat<Carousel>(
    x => x.filteredItems,
    html<Carousel>`<button class="slideTab">
        ${(x, c) => {
            return c.index + 1;
        }}
    </button>`,
    { positioning: true }
)}</div>
    </div>
`;
