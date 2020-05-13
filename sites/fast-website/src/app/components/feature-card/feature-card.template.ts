import { html } from "@microsoft/fast-element";
import { FeatureCard } from "./feature-card";

export const FeatureCardTemplate = html<FeatureCard>`
    <header>
        <slot name="header"></slot>
    </header>
    <main>
        <slot></slot>
        <div>
            <slot name="footer"></slot>
        </div>
    </main>
`;
