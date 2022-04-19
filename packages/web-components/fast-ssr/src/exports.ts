import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import {
    Compiler,
    DOM,
    ElementStyles,
    ViewBehaviorFactory,
} from "@microsoft/fast-element";
import { RenderInfo } from "@lit-labs/ssr";
import { FASTElementRenderer } from "./element-renderer/element-renderer.js";
import { FASTSSRStyleStrategy } from "./element-renderer/style-strategy.js";
import {
    FASTStyleStyleRenderer,
    StyleElementStyleRenderer,
    StyleRenderer,
} from "./styles/style-renderer.js";
import { defaultViewBehaviorFactoryRenderers } from "./template-renderer/directives.js";
import {
    TemplateRenderer,
    TemplateRendererConfiguration,
} from "./template-renderer/template-renderer.js";
import { SSRView } from "./view.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fastStyleDefinition = readFileSync(
    resolve(__dirname, "./styles/fast-style.js")
).toString();

export type Configuration = TemplateRendererConfiguration;
Compiler.setDefaultStrategy(
    (
        html: string | HTMLTemplateElement,
        factories: Record<string, ViewBehaviorFactory>
    ) => {
        if (typeof html !== "string") {
            throw new Error(
                "SSR compiler does not support HTMLTemplateElement templates"
            );
        }

        return new SSRView(html, factories) as any;
    }
);

ElementStyles.setDefaultStrategy(FASTSSRStyleStrategy);
DOM.setUpdateMode(false);

/**
 * Factory for creating SSR rendering assets.
 * @param config - FAST SSR configuration
 *
 * @example
 * ```ts
 * import "@microsoft/install-dom-shim";
 * import fastSSR from "@microsoft/fast-ssr";
 * import { html } from "@microsoft/fast-element";
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
    fastStyleDefinition: string;
} {
    const templateRenderer = new TemplateRenderer(config);
    const elementRenderer = class extends FASTElementRenderer {
        protected templateRenderer: TemplateRenderer = templateRenderer;
        protected styleRenderer: StyleRenderer = config?.useFASTStyle
            ? new FASTStyleStyleRenderer()
            : new StyleElementStyleRenderer();
    };

    templateRenderer.withViewBehaviorFactoryRenderers(
        ...defaultViewBehaviorFactoryRenderers
    );

    return {
        templateRenderer,
        elementRenderer,
        defaultRenderInfo: {
            elementRenderers: [elementRenderer],
            customElementHostStack: [],
            customElementInstanceStack: [],
        },
        fastStyleDefinition,
    };
}
