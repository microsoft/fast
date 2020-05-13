import { html, ref } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { Button } from "./";

export const ButtonTemplate = html<Button>`
    <template class="${x => x.appearance}">
        <button
            class="control"
            ?autofocus=${x => x.autofocus}
            ?disabled=${x => x.disabled}
            form=${x => x.formId}
            formaction=${x => x.formaction}
            formenctype=${x => x.formenctype}
            formmethod=${x => x.formmethod}
            formnovalidate=${x => x.formnovalidate}
            formtarget=${x => x.formtarget}
            name=${x => x.name}
            type=${x => x.type}
            value=${x => x.value}
        >
            ${startTemplate}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${endTemplate}
        </button>
    </template>
`;
