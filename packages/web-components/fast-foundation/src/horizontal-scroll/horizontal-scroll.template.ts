import {
    elements,
    html,
    ref,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import { endTemplate, startTemplate } from "../patterns";
import type { HorizontalScroll, HorizontalScrollOptions } from "./horizontal-scroll";

/**
 * @public
 */
export const horizontalScrollTemplate: FoundationElementTemplate<
    ViewTemplate<HorizontalScroll>,
    HorizontalScrollOptions
> = (context, definition) => html`
    <template
        class="horizontal-scroll"
        @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
    >
        ${startTemplate(context, definition)}
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
                        ${ref("previousFlipperContainer")}
                    >
                        <div class="scroll-action">
                            <slot name="previous-flipper">
                                ${definition.previousFlipper instanceof Function
                                    ? definition.previousFlipper(context, definition)
                                    : definition.previousFlipper ?? ""}
                            </slot>
                        </div>
                    </div>
                    <div
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${ref("nextFlipperContainer")}
                    >
                        <div class="scroll-action">
                            <slot name="next-flipper">
                                ${definition.nextFlipper instanceof Function
                                    ? definition.nextFlipper(context, definition)
                                    : definition.nextFlipper ?? ""}
                            </slot>
                        </div>
                    </div>
                `
            )}
        </div>
        ${endTemplate(context, definition)}
    </template>
`;
