import {
    elements,
    ElementViewTemplate,
    html,
    ref,
    slotted,
    when,
} from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type {
    FASTHorizontalScroll,
    HorizontalScrollOptions,
} from "./horizontal-scroll.js";

/**
 * @public
 */
export function horizontalScrollTemplate(
    options: HorizontalScrollOptions = {}
): ElementViewTemplate<FASTHorizontalScroll> {
    return html`
        <template
            class="horizontal-scroll"
            @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
        >
            ${startSlotTemplate(options)}
            <div class="scroll-area" part="scroll-area">
                <div
                    class="scroll-view"
                    part="scroll-view"
                    @scroll="${x => x.scrolled()}"
                    ${ref("scrollContainer")}
                >
                    <div
                        class="content-container"
                        part="content-container"
                        ${ref("content")}
                    >
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
                    html<FASTHorizontalScroll>`
                        <div
                            class="scroll scroll-prev"
                            part="scroll-prev"
                            ${ref("previousFlipperContainer")}
                        >
                            <div class="scroll-action" part="scroll-action-previous">
                                <slot name="previous-flipper">
                                    ${options.previousFlipper ?? ""}
                                </slot>
                            </div>
                        </div>
                        <div
                            class="scroll scroll-next"
                            part="scroll-next"
                            ${ref("nextFlipperContainer")}
                        >
                            <div class="scroll-action" part="scroll-action-next">
                                <slot name="next-flipper">
                                    ${options.nextFlipper ?? ""}
                                </slot>
                            </div>
                        </div>
                    `
                )}
            </div>
            ${endSlotTemplate(options)}
        </template>
    `;
}
