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
        <div class="icon-container" part="icon-container">
            <slot name="empty-icon" part="empty-icon">
                ${definition.emptyIcon || ""}
            </slot>
            <slot name="fill-icon" part="fill-icon">
                ${definition.filledIcon || ""}
            </slot>
        </div>
    </template>
`;
