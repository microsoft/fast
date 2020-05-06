import { html } from "@microsoft/fast-element";
import { SectionHeader } from "./section-header";

export const SectionHeaderTemplate = html<SectionHeader>`
    <div>
        <h5 part="h5">${x => x.title}</h5>
        <h1>${x => x.subTitle}</h1>
        <p>${x => x.description}</p>
        <slot name="button"></slot>
    </div>
`;
