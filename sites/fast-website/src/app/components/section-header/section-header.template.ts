import { html } from "@microsoft/fast-element";
import { SectionHeader } from "./section-header";

export const SectionHeaderTemplate = html<SectionHeader>`
    <template>
        <slot></slot>
        <slot name="badge"></slot>
        <slot name="body"></slot>
        <slot name="action"></slot>
    </template>
`;
