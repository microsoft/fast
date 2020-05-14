import { html, when } from "@microsoft/fast-element";
import { ContentPlacement } from "./content-placement";

export const ContentPlacementTemplate = html<ContentPlacement>`<fast-card>
    <div class=${x => (x.divider ? "" : "contentPlacement_icon")}>
        <slot name="icon"></slot>
    </div>
    <slot></slot>
    <slot name="body"></slot>
    ${when(
        x => x.divider,
        html`<fast-divider class="contentPlacement_divider"></fast-divider>`
    )}
    <div
        class=${x =>
            x.divider
                ? "contentPlacement_footer__hoverVisible"
                : "contentPlacement_footer__alwaysVisible"}
    >
        <slot name="action"></slot>
        <slot name="compatibility"></slot>
    </div>
</fast-card> `;
