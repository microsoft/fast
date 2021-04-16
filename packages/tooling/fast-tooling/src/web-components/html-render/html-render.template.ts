import { children, elements, html, ref, slotted, when } from "@microsoft/fast-element";
import { HTMLRender } from "./html-render";

export const HTMLRenderTemplate = html<HTMLRender>`
    <div class="container" @click="${(x,c)=>x.containerClickHandler(c.event as MouseEvent)}">
        <div class="htmlRender" 
            @click="${(x,c)=>x.clickHandler(c.event as MouseEvent)}" 
            @mouseover="${(x,c)=>x.hoverHandler(c.event as MouseEvent)}" 
            @mouseout="${(x,c)=>x.blurHandler(c.event as MouseEvent)}" 
            @keydown="${(x,c)=>x.keyDownHandler(c.event as KeyboardEvent)}" 
            @keyup="${(x,c)=>x.keyUpHandler(c.event as KeyboardEvent)}" 
            :innerHTML="${x=>x.markup ? x.markup.outerHTML : ''}"
            tabindex="1">
        </div>
        <div id="overlayContainer">
            <div id="clickDisplay" class="${x=>x.clickClassName}" style="top:${x=>x.clickPosition.top}px;left:${x=>x.clickPosition.left}px;width:${x=>x.clickPosition.width}px;height:${x=>x.clickPosition.height}px">
                <div class="pill">${x=>x.clickPillContent}</div>
            </div>
            <div id="hoverDisplay" class="${x=>x.hoverClassName}" style="top:${x=>x.hoverPosition.top}px;left:${x=>x.hoverPosition.left}px;width:${x=>x.hoverPosition.width}px;height:${x=>x.hoverPosition.height}px">
                <div class="pill">${x=>x.hoverPillContent}</div>
            </div>
        </div>
    </div>
`;