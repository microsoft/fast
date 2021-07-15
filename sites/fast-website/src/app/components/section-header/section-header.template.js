import { html } from "@microsoft/fast-element";
export const SectionHeaderTemplate = html`
    <template>
        <slot name="badge"></slot>
        <slot></slot>
        <slot name="body"></slot>
        <slot name="action"></slot>
    </template>
`;
