import { html, ref } from "@microsoft/fast-element";
import { Scroller } from "./scroller";

export const ControlsTemplate = html<Scroller>`
    <div ${ref("previousFlipper")} class="scroll scroll-prev hide">
        <div @click="${x => x.scrollToPrevious()}" class="scroll-cntrl">
            <slot name="previous-flipper"></slot>
        </div>
    </div>
    <div ${ref("nextFlipper")} class="scroll scroll-next show">
        <div @click="${x => x.scrollToNext()}" class="scroll-cntrl">
            <slot name="next-flipper"></slot>
        </div>
    </div>
`;

export const ScrollerTemplate = html<Scroller>`
    <div class="scroller">
        <slot name="start"></slot>
        <div class="scroll-area">
            <div class="scroll-view">
                <div ${ref("content")} class="scroll-content">
                    <slot></slot>
                </div>
            </div>
            ${x => (x.view === "mobile" ? "" : ControlsTemplate)}
        </div>
        <slot name="end"></slot>
    </div>
`;
