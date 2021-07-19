import React from "react";
import { DesignSystem } from "@microsoft/fast-foundation";
import {
    fastToolingHTMLRender,
    fastToolingHTMLRenderLayerInlineEdit,
    fastToolingHTMLRenderLayerNavigation,
} from "@microsoft/fast-tooling";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
DesignSystem.getOrCreate().register(
    fastToolingHTMLRender({ prefix: "fast-tooling" }),
    fastToolingHTMLRenderLayerNavigation({ prefix: "fast-tooling" }),
    fastToolingHTMLRenderLayerInlineEdit({ prefix: "fast-tooling" })
);

export class HTMLRenderReact extends React.Component {
    public renderRef: React.RefObject<HTMLDivElement>;

    private setRenderRef = el => {
        this.renderRef = el;
    };

    render() {
        return (
            <fast-tooling-html-render ref={this.setRenderRef}>
                <fast-tooling-html-render-layer-navigation role="htmlrenderlayer"></fast-tooling-html-render-layer-navigation>
                <fast-tooling-html-render-layer-inline-edit role="htmlrenderlayer"></fast-tooling-html-render-layer-inline-edit>
            </fast-tooling-html-render>
        );
    }
}
