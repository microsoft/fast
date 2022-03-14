import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns";
import { whitespaceFilter } from "../utilities";
import type { FoundationElementTemplate } from "../foundation-element";
import type { Search, SearchOptions } from "./search";
import { reflectAttributes } from "../directives/reflect-attributes";

/**
 * The template for the {@link @microsoft/fast-foundation#(Search:class)} component.
 * @public
 */
export const searchTemplate: FoundationElementTemplate<
    ViewTemplate<Search>,
    SearchOptions
> = (context, definition) => html`
    <template
        class="
            ${x => (x.readOnly ? "readonly" : "")}
        "
    >
        <label
            part="label"
            for="control"
            class="${x =>
                x.defaultSlottedNodes && x.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot
                ${slotted({ property: "defaultSlottedNodes", filter: whitespaceFilter })}
            ></slot>
        </label>
        <div class="root" part="root" ${ref("root")}>
            ${startSlotTemplate(context, definition)}
            <div class="input-wrapper" part="input-wrapper">
                <input
                    class="control"
                    part="control"
                    id="control"
                    @input="${x => x.handleTextInput()}"
                    @change="${x => x.handleChange()}"
                    ?autofocus="${x => x.autofocus}"
                    ?disabled="${x => x.disabled}"
                    ?readonly="${x => x.readOnly}"
                    ?required="${x => x.required}"
                    ?spellcheck="${x => x.spellcheck}"
                    :value="${x => x.value}"
                    type="search"
                    ${reflectAttributes(
                        "list",
                        "maxlength",
                        "minlength",
                        "pattern",
                        "placeholder",
                        "size",
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
                    ${ref("control")}
                />
                <slot name="close-button">
                    <button
                        class="clear-button ${x =>
                            x.value ? "" : "clear-button__hidden"}"
                        part="clear-button"
                        tabindex="-1"
                        @click=${x => x.handleClearInput()}
                    >
                        <slot name="close-glyph">
                            <svg
                                width="9"
                                height="9"
                                viewBox="0 0 9 9"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.146447 0.146447C0.338683 -0.0478972 0.645911 -0.0270359 0.853553 0.146447L4.5 3.793L8.14645 0.146447C8.34171 -0.0488155 8.65829 -0.0488155 8.85355 0.146447C9.04882 0.341709 9.04882 0.658291 8.85355 0.853553L5.207 4.5L8.85355 8.14645C9.05934 8.35223 9.03129 8.67582 8.85355 8.85355C8.67582 9.03129 8.35409 9.02703 8.14645 8.85355L4.5 5.207L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L3.793 4.5L0.146447 0.853553C-0.0268697 0.680237 -0.0457894 0.34079 0.146447 0.146447Z"
                                />
                            </svg>
                        </slot>
                    </button>
                </slot>
            </div>
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;
