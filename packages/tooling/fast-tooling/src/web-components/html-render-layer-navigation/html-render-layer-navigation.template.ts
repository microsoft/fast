import { html, ViewTemplate } from "@microsoft/fast-element";
import { ElementDefinitionContext } from "@microsoft/fast-foundation";
import { HTMLRenderLayerNavigation } from "./html-render-layer-navigation";

export const htmlRenderLayerNavigationTemplate: (
    context: ElementDefinitionContext
) => ViewTemplate<HTMLRenderLayerNavigation> = context => {
    return html`
        <div class="navigation-region">
            <div
                class="${x =>
                    x.clickLayerActive && !x.clickLayerHide
                        ? "click-layer active"
                        : "click-layer"}"
                style="top:${x => x.clickPosition.top}px;left:${x =>
                    x.clickPosition.left}px;width:${x =>
                    x.clickPosition.width}px;height:${x => x.clickPosition.height}px"
            >
                <div class="pill">${x => x.clickPillContent}</div>
            </div>
            <div
                class="${x =>
                    x.hoverLayerActive ? "hover-layer active" : "hover-layer"}"
                style="top:${x => x.hoverPosition.top}px;left:${x =>
                    x.hoverPosition.left}px;width:${x =>
                    x.hoverPosition.width}px;height:${x => x.hoverPosition.height}px"
            >
                <div class="pill">${x => x.hoverPillContent}</div>
            </div>
            <div
                class="${x =>
                    x.hoverLayerActive && !x.hoverLayerHide
                        ? "hover-layer active"
                        : "hover-layer"}"
                style="top:${x => x.hoverPosition.top}px;left:${x =>
                    x.hoverPosition.left}px;width:${x =>
                    x.hoverPosition.width}px;height:${x => x.hoverPosition.height}px"
            >
                <div class="pill">${x => x.hoverPillContent}</div>
            </div>
        </div>
    `;
};
