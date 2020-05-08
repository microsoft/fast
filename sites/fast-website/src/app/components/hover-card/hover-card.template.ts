import { html, when } from "@microsoft/fast-element";
import { HoverCard } from "./hover-card";

export const HoverCardTemplate = html<HoverCard>`<fast-card >
    <slot name="icon" class="hoverCard_icon"></slot>
    <slot></slot>
    <slot name="body"></slot>
    ${when(x => x.divider, html`<fast-divider class="hoverCard_divider"></fast-divider>`)}
    <div class=${x => x.divider ? "hoverCard_footer__hoverVisible" : "hoverCard_footer__alwaysVisible" }>
        <slot name="action"></slot>
        <slot name="compatibility"></slot>
    </div>
</fast-card>
`;