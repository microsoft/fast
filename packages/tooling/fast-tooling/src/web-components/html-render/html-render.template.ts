import { children, elements, html, ref, slotted, when } from "@microsoft/fast-element";
import { HTMLRender } from "./html-render";

export const HTMLRenderTemplate = html<HTMLRender>`
    <div class="htmlRender" :innerHTML="${x=>x.markup ? x.markup.outerHTML : ''}"></div>
`;