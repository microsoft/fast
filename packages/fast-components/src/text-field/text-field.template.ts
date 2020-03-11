import { html, when } from "@microsoft/fast-element";
import { ref } from "@microsoft/fast-element/dist/directives";
import { TextField } from "./text-field";

export const TextFieldTemplate = html<TextField>`
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
    <div class="root" part="root">
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
            id=${x => (x.childNodes.length ? "control" : void 0)}
            $type=${x => x.type}
            $disabled=${x => x.disabled}
            $placeholder=${x => x.placeholder}
            $list=${x => x.list}
            $maxlength=${x => x.maxlength}
            $minlength=${x => x.minlength}
            $pattern=${x => x.pattern}
            $readonly=${x => x.readonly}
            $required=${x => x.required}
            $size=${x => x.size}
            $spellcheck=${x => x.spellcheck}
            $value=${x => x.value}
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
`;
