import { html, ref, when, slotted } from "@microsoft/fast-element";
import { TextArea, TextAreaResize } from "./text-area.js";

export const TextAreaTemplate = html<TextArea>`
    <template
        class="
            ${x => x.appearance}
            ${x => (x.readOnly ? "readonly" : "")}
            ${x => (x.resize !== TextAreaResize.none ? `resize-${x.resize}` : "")}"
    >
        <label part="label" for="control" class="${x =>
            x.defaultSlottedNodes && x.defaultSlottedNodes.length
                ? "label"
                : "label__hidden"}">
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${x => x.autofocus}"
            cols="${x => x.cols}"
            ?disabled="${x => x.disabled}"
            form="${x => x.form}"
            list="${x => x.list}"
            maxlength="${x => x.maxlength}"
            minlength="${x => x.minlength}"
            name="${x => x.name}"
            placeholder="${x => x.placeholder}"
            ?readonly="${x => x.readOnly}"
            ?required="${x => x.required}"
            rows="${x => x.rows}"
            ?spellcheck="${x => x.spellcheck}"
            value="${x => x.value}"
            @input=${x => x.handleTextInput()}"
            ${ref("textarea")}
        ></textarea>
    </template>
`;
