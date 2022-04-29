import { html, ref, SyntheticViewTemplate } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system/registration-context.js";

/**
 * Start configuration options
 * @public
 */
export type StartOptions = {
    start?: string | SyntheticViewTemplate;
};

/**
 * End configuration options
 * @public
 */
export type EndOptions = {
    end?: string | SyntheticViewTemplate;
};

/**
 * Start/End configuration options
 * @public
 */
export type StartEndOptions = StartOptions & EndOptions;

/**
 * A mixin class implementing start and end slots.
 * These are generally used to decorate text elements with icons or other visual indicators.
 * @public
 */
export class StartEnd {
    public start: HTMLSlotElement;

    public end: HTMLSlotElement;
}

/**
 * The template for the end slot.
 * For use with {@link StartEnd}
 *
 * @public
 */
export const endSlotTemplate: (
    context: ElementDefinitionContext,
    definition: EndOptions
) => ViewTemplate<StartEnd> = (
    context: ElementDefinitionContext,
    definition: EndOptions
) => html`
    <slot name="end" ${ref("end")}>${definition.end || ""}</slot>
`;

/**
 * The template for the start slots.
 * For use with {@link StartEnd}
 *
 * @public
 */
export const startSlotTemplate: (
    context: ElementDefinitionContext,
    definition: StartOptions
) => ViewTemplate<StartEnd> = (
    context: ElementDefinitionContext,
    definition: StartOptions
) =>
    html`
        <slot name="start" ${ref("start")}>${definition.start || ""}</slot>
    `;
