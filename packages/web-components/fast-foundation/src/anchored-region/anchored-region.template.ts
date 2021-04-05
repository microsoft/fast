import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";

/**
 * The template for the {@link @microsoft/fast-foundation#(AnchoredRegion:class)} component.
 * @beta
 */
export const AnchoredRegionTemplate: (
    context,
    definition
) => ViewTemplate<AnchoredRegion> = (context, definition) => html`
    <${context.tagFor(AnchoredRegion)} class="${x =>
    x.initialLayoutComplete ? "loaded" : ""}">
        ${when(
            x => x.initialLayoutComplete,
            html<AnchoredRegion>`
                <slot></slot>
            `
        )}
    </${context.tagFor(AnchoredRegion)}>
`;
