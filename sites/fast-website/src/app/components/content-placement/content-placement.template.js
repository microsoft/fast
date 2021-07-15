import { html, when } from "@microsoft/fast-element";
export const ContentPlacementTemplate = html`
    <fast-card>
        <div class=${x => (x.icon ? "contentPlacement_icon" : "")}>
            <slot name="icon"></slot>
        </div>
        <slot></slot>
        <slot name="body"></slot>
        ${when(
            x => x.icon,
            html`
                <slot name="action"></slot>
            `
        )}
    </fast-card>
`;
