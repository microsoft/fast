import {
    html,
    ref,
    repeat,
    slotted,
    children,
    when,
    ViewTemplate,
} from "@microsoft/fast-element";
import { Carousel } from "./carousel";
import { FlipperDirection } from "../flipper";

// TODO: ADD play/pause controls

const slidePickerTemplate: ViewTemplate = html<Carousel>`
    <fast-tabs activeindicator="false" activeid="${(x, c) => x.activeid}">
        ${repeat(
            x => x.filteredItems,
            html`<div
                slot="tab"
                id="tab-${(x, c) => c.index + 1}"
                class="slide-tab"
            ></div>`,
            { positioning: true }
        )}
        ${x => html<Carousel>`
            ${x.filteredItems.map(
                (item: HTMLElement, index) =>
                    `<fast-tab-panel id="panel-${index + 1}">${
                        item.outerHTML
                    }</fast-tab-panel>`
            )}
        `}
    </fast-tabs>
`;

export const CarouselTemplate = html<Carousel>`
<template>
    <slot style="display: none;" ${slotted("items")}></slot>
    
    ${when(x => x.slidePicker, slidePickerTemplate)}

    <slot name="play-toggle"></slot>
        <div class="previous-flipper" @click="${(x, c) =>
            x.handleFlipperClick(-1, c.event as MouseEvent)}">
            <slot name="previous-button">
                <fast-flipper direction=${FlipperDirection.previous}>
            </slot>
        </div>
        <div class="next-flipper" @click="${(x, c) =>
            x.handleFlipperClick(1, c.event as MouseEvent)}">
            <slot name="next-button">
                <fast-flipper direction=${FlipperDirection.next}>
            </slot>
        </div>
</template>`;
