import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import { Option } from "./option";
import { OptionRole } from "./option.options";

/**
 * The template for the {@link @microsoft/fast-foundation#(Option:class)} component.
 * @public
 */
export const OptionTemplate = html<Option>`
    <template
        aria-selected="${x => (x.selected ? true : false)}"
        class="${x => (x.selected ? "selected" : "")} ${x =>
            x.disabled ? "disabled" : ""}"
        role="${OptionRole.option}"
    >
        ${startTemplate}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endTemplate}
    </template>
`;
