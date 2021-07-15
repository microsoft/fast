import { html } from "@microsoft/fast-element";
export const FeatureCardTemplate = html`
    <div class="card_heading">
        <slot></slot>
    </div>
    <div class="card_body">
        <slot name="body"></slot>
        <div>
            <slot name="footer"></slot>
        </div>
    </div>
`;
