import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { DesignSystemProvider } from "./design-system-provider";

/**
 * The template for the {@link @microsoft/fast-foundation#DesignSystemProvider} component.
 * @public
 */
export const DesignSystemProviderTemplate: ViewTemplate<DesignSystemProvider> = html`
    <slot></slot>
`;
