import { RenderInfo } from "@lit-labs/ssr";
import { Compiler, HTMLDirective } from "@microsoft/fast-element";
import { FASTElementRenderer } from "./element-renderer/element-renderer.js";
import { defaultFASTDirectiveRenderers } from "./template-renderer/directives.js";
import {
    TemplateRenderer,
    TemplateRendererConfiguration,
} from "./template-renderer/template-renderer.js";
import { SSRView } from "./view.js";

export type Configuration = TemplateRendererConfiguration;
Compiler.setDefaultStrategy(
    (html: string | HTMLTemplateElement, directives: ReadonlyArray<HTMLDirective>) => {
        if (typeof html !== "string") {
            throw new Error(
                "SSR compiler does not support HTMLTemplateElement templates"
            );
        }

        return new SSRView(html, directives) as any;
    }
);

/**
 * Factory for creating SSR rendering assets.
 * @param config - FAST SSR configuration
 *
 * @example
 * ```ts
 * import "@lit-labs/ssr/lib/install-global-dom-shim.js";
 * import { html } from "@microsoft/fast-element";
 * import fastSSR from "@microsoft/fast-ssr";
 * const { templateRenderer, defaultRenderInfo } = fastSSR();
 *
 * const streamableSSRResult = templateRenderer.render(html`...`, defaultRenderInfo);
 * ```
 */
export default function (
    config?: Configuration
): {
    templateRenderer: TemplateRenderer;
    elementRenderer: typeof FASTElementRenderer;
    defaultRenderInfo: RenderInfo;
} {
    const templateRenderer = new TemplateRenderer(config);
    const elementRenderer = class extends FASTElementRenderer {
        protected templateRenderer: TemplateRenderer = templateRenderer;
    };

    templateRenderer.withDirectiveRenderer(...defaultFASTDirectiveRenderers);

    return {
        templateRenderer,
        elementRenderer,
        defaultRenderInfo: {
            elementRenderers: [elementRenderer],
            customElementHostStack: [],
            customElementInstanceStack: [],
        },
    };
}
