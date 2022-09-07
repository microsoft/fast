import type { ElementViewTemplate } from "@microsoft/fast-element";
import { elements, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate, tagFor } from "../patterns/index.js";
import type { FASTHorizontalScroll } from "./horizontal-scroll.js";
import type { HorizontalScrollOptions } from "./horizontal-scroll.options.js";

/**
 * @public
 */
export function horizontalScrollTemplate<T extends FASTHorizontalScroll>(
    options: HorizontalScrollOptions
): ElementViewTemplate<T> {
    const flipperTag = tagFor(options.flipper);
    return html<T>`
        <template @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}">
            ${startSlotTemplate(options)}
            <div class="scroll-area" part="scroll-area">
                <div
                    class="scroll-view"
                    part="scroll-view"
                    @scroll="${x => x.scrolled()}"
                    ${ref("scrollContainer")}
                >
                    <div class="content" part="content" ${ref("content")}>
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
                    html<T>`
                        <div
                            class="scroll scroll-previous"
                            part="scroll-previous"
                            ${ref("previousFlipperContainer")}
                        >
                            <slot name="previous-flipper">
                                ${options.previousFlipper ??
                                html<T>`
                                    <${flipperTag}
                                        part="previous-flipper"
                                        @click="${x => x.scrollToPrevious()}"
                                        direction="previous"
                                        aria-hidden="${x => x.flippersHiddenFromAT}"
                                    ></${flipperTag}>
                                `}
                            </slot>
                        </div>
                        <div
                            class="scroll scroll-next"
                            part="scroll-next"
                            ${ref("nextFlipperContainer")}
                        >
                            <slot name="next-flipper">
                                ${options.nextFlipper ??
                                html<T>`
                                    <${flipperTag}
                                        part="next-flipper"
                                        @click="${x => x.scrollToNext()}"
                                        aria-hidden="${x => x.flippersHiddenFromAT}"
                                    ></${flipperTag}>
                                `}
                            </slot>
                        </div>
                    `
                )}
            </div>
            ${endSlotTemplate(options)}
        </template>
    `;
}
