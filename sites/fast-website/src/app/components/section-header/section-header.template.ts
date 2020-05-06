import { html } from "@microsoft/fast-element";
import { SectionHeader } from "./section-header";

export const SectionHeaderTemplate = html<SectionHeader>`
    <template>
        <slot name="heading"></slot>
        <h1 part="short">${x => x.short}</h1>
        <p part="body" class="body">${x => x.body}</p>
        <slot name="button"></slot>
    </template>
`;
