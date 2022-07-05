import { html, ref, SyntheticViewTemplate, ViewTemplate } from "@microsoft/fast-element";

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
export function endSlotTemplate(options: EndOptions): ViewTemplate<StartEnd> {
    return html`
        <slot name="end" ${ref("end")}>${options.end || ""}</slot>
    `;
}

/**
 * The template for the start slots.
 * For use with {@link StartEnd}
 *
 * @public
 */
export function startSlotTemplate(options: StartOptions): ViewTemplate<StartEnd> {
    return html`
        <slot name="start" ${ref("start")}>${options.start || ""}</slot>
    `;
}
