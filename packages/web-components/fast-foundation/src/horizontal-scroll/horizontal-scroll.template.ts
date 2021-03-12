import { elements, html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import type { HorizontalScroll } from "./horizontal-scroll";

/**
 * @public
 */
export const HorizontalScrollTemplate: ViewTemplate<HorizontalScroll> = html`
    <template role="horizontal-scroll" class="horizontal-scroll">
        ${startTemplate}
        <div class="scroll-area">
            <div
                class="scroll-view"
                @scroll="${x => x.scrolled()}"
                ${ref("scrollContainer")}
            >
                <div class="content-container">
                    <slot
                        ${slotted({
                            property: "scrollItems",
                            filter: elements(),
                        })}
                    ></slot>
                </div>
            </div>
            ${when(
                x => x.view !== "mobile",
                html<HorizontalScroll>`
                    <div
                        class="scroll scroll-prev"
                        part="scroll-prev"
                        ${ref("previousFlipper")}
                    >
                        <div class="scroll-action" @click="${x => x.scrollToPrevious()}">
                            <slot name="previous-flipper"></slot>
                        </div>
                    </div>
                    <div
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${ref("nextFlipper")}
                    >
                        <div class="scroll-action" @click="${x => x.scrollToNext()}">
                            <slot name="next-flipper"></slot>
                        </div>
                    </div>
                `
            )}
        </div>
        ${endTemplate}
    </template>
`;
