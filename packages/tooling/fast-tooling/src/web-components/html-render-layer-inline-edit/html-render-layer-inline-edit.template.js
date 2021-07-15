import { html, ref } from "@microsoft/fast-element";
export const HTMLRenderLayerInlineEditTemplate = html`
    <div class="edit-region">
        <textarea
            ${ref("textAreaRef")}
            class="${x => (x.textAreaActive ? "text-area active" : "text-area")}"
            @keydown="${(x, c) => x.handleKeyDown(c.event)}"
            @keyup="${(x, c) => x.handleTextInput(c.event)}"
            @click="${(x, c) => {
                c.event.stopPropagation();
                return false;
            }}"
            @focus="${(x, c) => {
                c.event.stopPropagation();
                return false;
            }}"
            @blur="${(x, c) => x.handleBlur(c.event)}"
            @scroll="${(x, c) => {
                c.event.stopPropagation();
                return false;
            }}"
            :value=${x => x.textValue}
        ></textarea>
    </div>
`;
