import { html } from "@microsoft/fast-element";
import { SectionHeader } from "./section-header";

export const SectionHeaderTemplate = html<SectionHeader>`
    <div>
        <h5 part="title">${x => x.title}</h5>
        <h1 part="sub-title">${x => x.subTitle}</h1>
        <p part="description">${x => x.description}</p>
        <slot name="button"></slot>
    </div>
`;
