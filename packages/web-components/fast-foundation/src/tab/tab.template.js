import { html } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#Tab} component.
 * @public
 */
export const tabTemplate = (context, definition) => html`
    <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
        <slot></slot>
    </template>
`;
