import { html, ref, SyntheticViewTemplate } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";

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
 * A mixin class implementing start and end elements.
 * These are generally used to decorate text elements with icons or other visual indicators.
 * @public
 */
export class StartEnd {
    public start: HTMLSlotElement;
    public startContainer: HTMLSpanElement;
    public handleStartContentChange(): void {
        this.startContainer.classList.toggle(
            "start",
            this.start.assignedNodes().length > 0
        );
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLSpanElement;
    public handleEndContentChange(): void {
        this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0);
    }
}

/**
 * The template for the end element.
 * For use with {@link StartEnd}
 *
 * @public
 */
export const endTemplate: (
    context: ElementDefinitionContext,
    definition: StartOptions
) => ViewTemplate<StartEnd> = (context: ElementDefinitionContext, definition) => html`
    <span part="end" ${ref("endContainer")}>
        <slot name="end" ${ref("end")} @slotchange="${x => x.handleEndContentChange()}">
            ${definition.start || ""}
        </slot>
    </span>
`;

/**
 * The template for the start element.
 * For use with {@link StartEnd}
 *
 * @public
 */
export const startTemplate: (
    context: ElementDefinitionContext,
    definition: EndOptions
) => ViewTemplate<StartEnd> = (
    context: ElementDefinitionContext,
    definition: EndOptions
) => html`
    <span part="start" ${ref("startContainer")}>
        <slot
            name="start"
            ${ref("start")}
            @slotchange="${x => x.handleStartContentChange()}"
        >
            ${definition.end || ""}
        </slot>
    </span>
`;
