import { html, repeat } from "@microsoft/fast-element";
import { DesignSystemProvider } from "./design-system-provider";

// TODO: height-number should be a string interpolation
export const DesignSystemProviderTemplate = html<DesignSystemProvider>`
    <template style="--height-number: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit));">
        <div class="inner">
            <slot></slot>
        </div>
    </template>
`;
