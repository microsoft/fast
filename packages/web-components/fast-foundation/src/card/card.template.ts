import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Card } from "./card.js";

/**
 * The template for the {@link @microsoft/fast-foundation#Card} component.
 * @public
 */
export const cardTemplate: FoundationElementTemplate<ViewTemplate<Card>> = (
    context,
    definition
) => html`
    <slot></slot>
`;
