import { html, ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { RatingItem, RatingItemOptions } from "./";

/**
 * The template for the {@link @microsoft/fast-foundation#(Ratingtem:class)} component.
 *
 * @public
 */
export const ratingItemTemplate: (
    context: ElementDefinitionContext,
    definition: RatingItemOptions
) => ViewTemplate<RatingItem> = (
    context: ElementDefinitionContext,
    definition: RatingItemOptions
) => html<RatingItem>`
    <template
        role="radio"
        class="${x => (x.checked ? "checked" : "")} ${x =>
            x.readOnly ? "readonly" : ""}"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        <div class="rating-icons" part="rating-icons">
            <slot name="unchecked-icon" part="unchecked-icon" aria-hidden="true">
                ${definition.uncheckedIcon || ""}
            </slot>
            <slot name="checked-icon" part="checked-icon" aria-hidden="true">
                ${definition.checkedIcon || ""}
            </slot>
        </div>
    </template>
`;
