import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { Button } from "./button";
/**
 * The template for the {@link @microsoft/fast-foundation#(Button:class)} component.
 * @public
 */
export const ButtonTemplate = html<Button>`
    <button
        class="control"
        part="control"
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
`;
