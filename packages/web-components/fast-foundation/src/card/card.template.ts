import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Card } from "./card";

/**
 * The template for the {@link @microsoft/fast-foundation#Card} component.
 * @public
 */
export const CardTemplate: ViewTemplate<Card> = html`
    <slot></slot>
`;
