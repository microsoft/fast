import { html, when } from "@microsoft/fast-element";
import { ContentCard } from "./content-card";

export const ContentCardTemplate = html<ContentCard>`<fast-card>
    <div class="contentCard_icon">
        <slot name="icon"></slot>
    </div>
    <slot></slot>
    <slot name="body"></slot>
    ${when(
        x => x.divider,
        html`<fast-divider class="contentCard_divider"></fast-divider>`
    )}
    <div
        class=${x =>
            x.divider
                ? "contentCard_footer__hoverVisible"
                : "contentCard_footer__alwaysVisible"}
    >
        <slot name="action"></slot>
        <slot name="compatibility"></slot>
    </div>
</fast-card> `;
