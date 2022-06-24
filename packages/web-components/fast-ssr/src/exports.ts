import {
    Compiler,
    ElementStyles,
    Updates,
    ViewBehaviorFactory,
} from "@microsoft/fast-element";
import { RenderInfo } from "./render-info.js";
import { FASTElementRenderer } from "./element-renderer/fast-element-renderer.js";
import { FASTSSRStyleStrategy } from "./element-renderer/style-strategy.js";
import { StyleElementStyleRenderer, StyleRenderer } from "./styles/style-renderer.js";
import {
    defaultViewBehaviorFactoryRenderers,
    ViewBehaviorFactoryRenderer,
} from "./template-renderer/directives.js";
import {
    ComponentDOMEmissionMode,
    TemplateRenderer,
} from "./template-renderer/template-renderer.js";
import { SSRView } from "./view.js";
import {
    ConstructableElementRenderer,
    ElementRenderer,
} from "./element-renderer/element-renderer.js";

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
Updates.setMode(false);

/**
 * Factory for creating SSR rendering assets.
 * @example
 * ```ts
 * import "@microsoft/install-dom-shim";
 * import fastSSR from "@microsoft/fast-ssr";
 * import { html } from "@microsoft/fast-element";
 * const { templateRenderer, defaultRenderInfo } = fastSSR();
 *
 * const streamableSSRResult = templateRenderer.render(html`...`, defaultRenderInfo);
 * ```
 *
 * @beta
 */
export default function fastSSR(): {
    templateRenderer: TemplateRenderer;
    elementRenderer: typeof FASTElementRenderer;
    defaultRenderInfo: RenderInfo;
} {
    const templateRenderer = new TemplateRenderer();
    const elementRenderer = class extends FASTElementRenderer {
        protected templateRenderer: TemplateRenderer = templateRenderer;
        protected styleRenderer = new StyleElementStyleRenderer();
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
    };
}

export * from "./request-storage.js";
export type {
    ComponentDOMEmissionMode,
    ElementRenderer,
    FASTElementRenderer,
    StyleRenderer,
    TemplateRenderer,
    ViewBehaviorFactoryRenderer,
    RenderInfo,
    ConstructableElementRenderer,
};
