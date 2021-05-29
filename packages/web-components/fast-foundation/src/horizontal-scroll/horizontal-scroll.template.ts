import { elements, html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import type { HorizontalScroll } from "./horizontal-scroll";

/**
 * @public
 */
export const HorizontalScrollTemplate: ViewTemplate<HorizontalScroll> = html`
    <template class="horizontal-scroll">
        ${startTemplate}
        <div class="scroll-area">
            ${when(
                x => x.view !== "mobile",
                html<HorizontalScroll>`
                    <div
                        class="scroll scroll-prev"
                        part="scroll-prev"
                        ${ref("previousFlipper")}
                    >
                        <button
                            class="scroll-action"
                            @click="${x => x.scrollToPrevious()}"
                            tabindex="-1"
                        >
                            <slot name="previous-flipper"></slot>
                        </button>
                    </div>
                `
            )}
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
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${ref("nextFlipper")}
                    >
                        <button
                            class="scroll-action"
                            @click="${x => x.scrollToNext()}"
                            tabindex="-1"
                        >
                            <slot name="next-flipper"></slot>
                        </button>
                    </div>
                `
            )}
        </div>
        ${endTemplate}
    </template>
`;
