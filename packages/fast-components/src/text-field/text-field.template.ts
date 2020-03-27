import { html, ref, when } from "@microsoft/fast-element";
import { TextField } from "./text-field";

export const TextFieldTemplate = html<TextField>`
<template
    role="textbox"
    appearance="${x => x.appearance}"
    aria-required="${x => x.required}"
    aria-disabled="${x => x.disabled}"
    aria-readonly="${x => x.readOnly}"
    tabindex="${x => (x.disabled ? null : 0)}"
>
    ${when(
        x => x.childNodes.length,
        html`
        <label
            part="label"
            class="label"
            for="control"
        ><slot></slot></label>
    `
    )}
    <div
        class="root"
        part="root"    
    >
        <span
            part="before-content"
            ${ref("beforeContentContainer")}
        >
            <slot
                name="before-content"
                @slotchange=${x => x.handleBeforeContentChange()}
                ${ref("beforeContent")}
            ></slot>
        </span>
        <input
            class="control"
            part="control"
            id="control"
            @input=${x => x.handleTextInput()}
            placeholder=${x => x.placeholder}
            ?required=${x => x.required}
            ?disabled=${x => x.disabled}
            ?readonly=${x => x.readOnly}
            value=${x => x.value}
            ${ref("control")}
        />
        <span
            part="after-content"
            ${ref("afterContentContainer")}
        >
            <slot
                name="after-content"
                @slotchange=${x => x.handleAfterContentChange()}
                ${ref("afterContent")}
            ></slot>
        </span>
    </div>
</template>
`;
