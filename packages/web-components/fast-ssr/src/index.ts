import {
    TemplateRenderer,
    TemplateRendererConfiguration,
} from "./template-renderer/template-renderer.js";
import { FASTElementRenderer } from "./element-renderer/element-renderer.js";

export type Configuration = TemplateRendererConfiguration;

/**
 * Factory for creating SSR rendering assets.
 * @param config - FAST SSR configuration
 *
 * @example
 * ```ts
 * import { html } from "@microsoft/fast-element";
 * import fastSSR from "@microsoft/fast-ssr";
 * const { templateRenderer, elementRenderer } = fastSSR();
 * const renderInfo = {
 *   elementRenderers: [elementRenderer],
 *   customElementHostStack: [],
 *   customElementInstanceStack: []
 * };
 *
 * const streamableSSRResult = templateRenderer.render(html`...`, renderInfo);
 * ```
 */
export default function (
    config: Configuration
): { templateRenderer: TemplateRenderer; elementRenderer: typeof FASTElementRenderer } {
    const templateRenderer = new TemplateRenderer(config);

    return {
        templateRenderer,
        elementRenderer: class extends FASTElementRenderer {
            protected templateRenderer: TemplateRenderer = templateRenderer;
        },
    } as any;
}
