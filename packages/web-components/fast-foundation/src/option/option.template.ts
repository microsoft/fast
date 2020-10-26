import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import { Option } from "./option";

/**
 * The template for the {@link @microsoft/fast-foundation#(Option:class)} component.
 * @public
 */
export const OptionTemplate = html<Option>`
    <template
        role="option"
        aria-selected="${x => x.selectedAttribute}"
        class="${x => (x.selected ? "selected" : "")} ${x =>
            x.disabled ? "disabled" : ""}"
        @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
    >
        ${startTemplate}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endTemplate}
    </template>
`;
