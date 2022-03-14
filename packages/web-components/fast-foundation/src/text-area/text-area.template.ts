import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import { TextAreaResize } from "./text-area";
import type { TextArea } from "./text-area";
import { reflectAttributes } from "../directives/reflect-attributes";

/**
 * The template for the {@link @microsoft/fast-foundation#(TextArea:class)} component.
 * @public
 */
export const textAreaTemplate: FoundationElementTemplate<ViewTemplate<TextArea>> = (
    context,
    definition
) => html`
    <template
        class="
            ${x => (x.readOnly ? "readonly" : "")}
            ${x => (x.resize !== TextAreaResize.none ? `resize-${x.resize}` : "")}"
    >
        <label
            part="label"
            for="control"
            class="${x =>
                x.defaultSlottedNodes && x.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${x => x.autofocus}"
            ?disabled="${x => x.disabled}"
            ?readonly="${x => x.readOnly}"
            ?required="${x => x.required}"
            ?spellcheck="${x => x.spellcheck}"
            :value="${x => x.value}"
            ${reflectAttributes(
                "cols",
                "form",
                "list",
                "maxlength",
                "minlength",
                "name",
                "placeholder",
                "rows",
                "aria-atomic",
                "aria-busy",
                "aria-controls",
                "aria-current",
                "aria-describedby",
                "aria-details",
                "aria-disabled",
                "aria-errormessage",
                "aria-flowto",
                "aria-haspopup",
                "aria-hidden",
                "aria-invalid",
                "aria-keyshortcuts",
                "aria-label",
                "aria-labelledby",
                "aria-live",
                "aria-owns",
                "aria-relevant",
                "aria-roledescription"
            )}
            @input="${(x, c) => x.handleTextInput()}"
            @change="${x => x.handleChange()}"
            ${ref("control")}
        ></textarea>
    </template>
`;
