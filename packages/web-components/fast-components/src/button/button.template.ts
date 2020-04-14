import { html, ref } from "@microsoft/fast-element";
import { Button } from "./";

export const ButtonTemplate = html<Button>`
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
        <span part="start" ${ref("startContainer")}>
            <slot
                name="start"
                ${ref("start")}
                @slotchange=${x => x.handleStartContentChange()}
            ></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <span part="end" ${ref("endContainer")}>
            <slot
                name="end"
                ${ref("end")}
                @slotchange=${x => x.handleEndContentChange()}
            ></slot>
        </span>
    </button>
`;
