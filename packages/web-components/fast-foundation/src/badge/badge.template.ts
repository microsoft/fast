import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Badge } from "./badge";

/**
 * The template for the {@link @microsoft/fast-foundation#Badge} component.
 * @public
 */
export const BadgeTemplate: (context, definition) => ViewTemplate<Badge> = (
    context,
    definition
) => html`
    <${context.tagFor(Badge)} class="${x => (x.circular ? "circular" : "")}">
        <div class="control" part="control" style="${x => x.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </${context.tagFor(Badge)}>
`;
