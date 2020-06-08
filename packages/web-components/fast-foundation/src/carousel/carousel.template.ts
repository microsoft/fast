import { html, ref, repeat, slotted } from "@microsoft/fast-element";
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
        <div class="carousel-items" aria-live="off">
        ${x => {
            console.log("FIRST ITEM: ", x.items[1]);
            return x.items[1];
        }}</div>
        <slot name="previous-button">
            <fast-flipper direction=${FlipperDirection.previous}> //TODO: HOW TO?
        </slot>
        <slot name="tab-list">${repeat(
            x => x.items,
            html<Carousel>`<button @click=${(x, c) => x.handleTabClick(c.event)}>
                ${(x, c) => c.index + 1}
            </button>`
        )}</slot>
    </div>
`;
