import { html, ref } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import { HorizontalScroll } from "./horizontal-scroll";

/**
 * @public
 */
export const ActionsTemplate = html<HorizontalScroll>`
    <div ${ref("previousFlipper")} class="scroll scroll-prev">
        <div @click="${x => x.scrollToPrevious()}" class="scroll-action">
            <slot name="previous-flipper"></slot>
        </div>
    </div>
    <div ${ref("nextFlipper")} class="scroll scroll-next">
        <div @click="${x => x.scrollToNext()}" class="scroll-action">
            <slot name="next-flipper"></slot>
        </div>
    </div>
`;

/**
 * @public
 */
export const HorizontalScrollTemplate = html<HorizontalScroll>`
    <template role="horizontal-scroll" class="horizontal-scroll">
        ${startTemplate}
        <div class="scroll-area">
            <div
                class="scroll-view"
                ${ref("scrollContainer")}
                @scroll="${x => x.scrolled()}"
            >
                <div class="content-container">
                    <slot></slot>
                </div>
            </div>
            ${x => (x.view === "mobile" ? "" : ActionsTemplate)}
        </div>
        ${endTemplate}
    </template>
`;
