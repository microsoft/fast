import { html, when } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#(AnchoredRegion:class)} component.
 * @beta
 */
export const anchoredRegionTemplate = (context, definition) => html`
    <template class="${x => (x.initialLayoutComplete ? "loaded" : "")}">
        ${when(
            x => x.initialLayoutComplete,
            html`
                <slot></slot>
            `
        )}
    </template>
`;
