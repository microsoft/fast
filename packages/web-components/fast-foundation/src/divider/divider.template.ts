import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Divider } from "./divider";

/**
 * The template for the {@link @microsoft/fast-foundation#Divider} component.
 * @public
 */
export const DividerTemplate: (context, definition) => ViewTemplate<Divider> = (
    context,
    definition
) => html`
    <${context.tagFor(Divider)} role="${x => x.role}"></${context.tagFor(Divider)}>
`;
