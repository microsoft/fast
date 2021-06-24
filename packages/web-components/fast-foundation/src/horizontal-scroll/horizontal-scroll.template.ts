import { elements, html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import type { HorizontalScroll, HorizontalScrollOptions } from "./horizontal-scroll";
import type { ElementDefinitionContext } from "../design-system";

/**
 * @public
 */
export const horizontalScrollTemplate: (
    context: ElementDefinitionContext,
    definition: HorizontalScrollOptions
) => ViewTemplate<HorizontalScroll> = (
    context: ElementDefinitionContext,
    definition: HorizontalScrollOptions
) => html`
    <template
        class="horizontal-scroll"
        @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
    >
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
                        ${ref("previousFlipperContainer")}
                    >
                        <div class="scroll-action">
                            <slot name="previous-flipper">
                                ${definition.previousFlipper || ""}
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
                                ${definition.nextFlipper || ""}
                            </slot>
                        </div>
                    </div>
                `
            )}
        </div>
        ${endTemplate}
    </template>
`;
