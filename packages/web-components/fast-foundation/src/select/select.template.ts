import { children, elements, html, ref, slotted } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { Select } from "./select";

/**
 * The template for the {@link @microsoft/fast-foundation#(Select:class)} component.
 * @public
 */
export const SelectTemplate = html<Select>`
    <template
        class="${x => (x.open ? "open" : "")}"
        ${children({ property: "options", filter: elements("fast-option") })}
    >
        <button
            class="button"
            ?disabled="${x => x.disabled}"
            part="button"
            ${ref("button")}
        >
            ${startTemplate}
            <slot name="button-container" ${slotted("slottedButtonContainer")}>
                <span class="selected-value" part="selected-value">
                    <slot name="selected-value">
                        ${x => x.displayValue}
                    </slot>
                </span>
                <span class="indicator" part="indicator" ${ref("indicatorContainer")}>
                    <slot name="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7">
                            <path
                                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
                            />
                        </svg>
                    </slot>
                </span>
            </slot>
            ${endTemplate}
        </button>
        <fast-listbox
            part="listbox"
            class="listbox"
            ?disabled="${x => x.disabled}"
            :hidden="${x => !x.open}"
            ${ref("listbox")}
        >
            <slot
                ${slotted({
                    filter: elements("fast-option"),
                    flatten: true,
                    property: "options",
                })}
            ></slot>
        </fast-listbox>
    </template>
`;
