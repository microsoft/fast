import { html, ref } from "@microsoft/fast-element";
import { HTMLRenderLayerInlineEdit } from "./html-render-layer-inline-edit";

export const HTMLRenderLayerInlineEditTemplate = html<HTMLRenderLayerInlineEdit>`
    <div class="edit-region">
        <textarea
            ${ref('textAreaRef')}
            class="${x => (x.textAreaActive ? "text-area active" : "text-area")}"
           @input="${(x, c) => x.handleTextInput(c.event)}"
           @click="${(x, c)=>{c.event.stopPropagation(); return false;}}"
           @focus="${(x, c)=>{c.event.stopPropagation(); return false;}}"
           @scroll="${(x, c)=>{c.event.stopPropagation(); return false;}}"
           :value=${x=>x.textValue}
        ></textarea>
    </div>
`;
