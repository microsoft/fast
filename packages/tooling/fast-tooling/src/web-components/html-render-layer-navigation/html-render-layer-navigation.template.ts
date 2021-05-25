import { html } from "@microsoft/fast-element";
import { HTMLRenderLayerNavgation } from "./html-render-layer-navigation";

export const HTMLRenderLayerNavigationTemplate = html<HTMLRenderLayerNavgation>`
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
            class="${x => (x.hoverLayerActive ? "hover-layer active" : "hover-layer")}"
            style="top:${x => x.hoverPosition.top}px;left:${x =>
                x.hoverPosition.left}px;width:${x =>
                x.hoverPosition.width}px;height:${x => x.hoverPosition.height}px"
        >
            <div class="pill">${x => x.hoverPillContent}</div>
        </div>
    </div>
`;
