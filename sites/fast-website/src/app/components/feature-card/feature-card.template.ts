import { html } from "@microsoft/fast-element";
import { FeatureCard } from "./feature-card";

export const FeatureCardTemplate = html<FeatureCard>`
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
