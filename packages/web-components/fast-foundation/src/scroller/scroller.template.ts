import { html, ref } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import { Scroller } from "./scroller";

/**
 * @public
 */
export const ControlsTemplate = html<Scroller>`
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
export const ScrollerTemplate = html<Scroller>`
    <template role="scroller" class="scroller">
        ${startTemplate}
        <div class="scroll-area">
            <div class="scroll-view">
                <div ${ref("contentContainer")} class="content-container">
                    <slot></slot>
                </div>
            </div>
            ${x => (x.view === "mobile" ? "" : ControlsTemplate)}
        </div>
        ${endTemplate}
    </template>
`;
