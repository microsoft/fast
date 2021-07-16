import { html, ref } from "@microsoft/fast-element";
import { HTMLRenderLayerInlineEdit } from "./html-render-layer-inline-edit";

export const htmlRenderLayerInlineEditTemplate = html<HTMLRenderLayerInlineEdit>`
    <div class="edit-region">
        <textarea
            ${ref("textAreaRef")}
            class="${x => (x.textAreaActive ? "text-area active" : "text-area")}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            @keyup="${(x, c) => x.handleTextInput(c.event as KeyboardEvent)}"
            @click="${(x, c) => {
                c.event.stopPropagation();
                return false;
            }}"
            @focus="${(x, c) => {
                c.event.stopPropagation();
                return false;
            }}"
            @blur="${(x, c) => x.handleBlur(c.event as InputEvent)}"
            @scroll="${(x, c) => {
                c.event.stopPropagation();
                return false;
            }}"
            :value=${x => x.textValue}
        ></textarea>
    </div>
`;
