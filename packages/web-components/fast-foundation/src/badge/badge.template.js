import { html } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#Badge} component.
 * @public
 */
export const badgeTemplate = (context, definition) => html`
    <template class="${x => (x.circular ? "circular" : "")}">
        <div class="control" part="control" style="${x => x.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;
