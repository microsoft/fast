import { html, when } from "@microsoft/fast-element";
import { TextArea } from "./text-area";

export const TextAreaTemplate = html<TextArea>`
    ${when(
        x => x.childNodes.length,
        html`
        <label
            part="label"
            class="label"
            for="control"
        >
            <slot name="label"></slot>
        </label>
    `
    )}
    <textarea
        part="control"
        class="control"
        id="${x => (x.childNodes.length ? "control" : null)}"
        $autofocus="${x => x.autofocus}"
        $cols="${x => x.cols}"
        $disabled="${x => x.disabled}"
        $form="${x => x.form}"
        $list="${x => x.list}"
        $maxlength="${x => x.maxlength}"
        $minlength="${x => x.minlength}"
        $name="${x => x.name}"
        $placeholder="${x => x.placeholder}"
        $readonly="${x => x.readonly}"
        $required="${x => x.required}"
        $rows="${x => x.rows}"
        $spellcheck="${x => x.spellcheck}"
    ><slot></slot></textarea>
`;
