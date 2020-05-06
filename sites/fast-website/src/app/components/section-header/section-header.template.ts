import { html } from "@microsoft/fast-element";
import { SectionHeader } from "./section-header";

export const SectionHeaderTemplate = html<SectionHeader>`
    <template>
        <slot name="heading"></slot>
        <p part="short">${x => x.short}</p>
        <p part="body">${x => x.body}</p>
        <slot name="button"></slot>
    </template>
`;
