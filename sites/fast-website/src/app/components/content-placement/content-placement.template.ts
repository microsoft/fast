import { html, when } from "@microsoft/fast-element";
import { ContentPlacement } from "./content-placement";

export const ContentPlacementTemplate = html<ContentPlacement>`<fast-card>
    <div class=${x => (x.icon ? "contentPlacement_icon" : "")}>
        <slot name="icon"></slot>
    </div>
    <slot></slot>
    <slot name="body"></slot>
    ${when(x => x.icon, html`<slot name="action"></slot>`)}
</fast-card> `;
