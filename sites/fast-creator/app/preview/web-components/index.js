import React from "react";
import { DesignSystem } from "@microsoft/fast-foundation";
import { fastToolingHTMLRenderLayerInlineEdit } from "@microsoft/fast-tooling/dist/esm/web-components/html-render-layer-inline-edit/html-render-layer-inline-edit";
import { fastToolingHTMLRender } from "@microsoft/fast-tooling/dist/esm/web-components/html-render";
import { fastToolingHTMLRenderLayerNavigation } from "@microsoft/fast-tooling/dist/esm/web-components/html-render-layer-navigation";
/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
DesignSystem.getOrCreate().register(
    fastToolingHTMLRender({ prefix: "fast-tooling" }),
    fastToolingHTMLRenderLayerNavigation({ prefix: "fast-tooling" }),
    fastToolingHTMLRenderLayerInlineEdit({ prefix: "fast-tooling" })
);
export class HTMLRenderReact extends React.Component {
    constructor() {
        super(...arguments);
        this.setRenderRef = el => {
            this.renderRef = el;
        };
    }
    render() {
        return (
            <fast-tooling-html-render ref={this.setRenderRef}>
                <fast-tooling-html-render-layer-navigation role="htmlrenderlayer"></fast-tooling-html-render-layer-navigation>
                <fast-tooling-html-render-layer-inline-edit role="htmlrenderlayer"></fast-tooling-html-render-layer-inline-edit>
            </fast-tooling-html-render>
        );
    }
}
