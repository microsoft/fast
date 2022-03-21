import { html } from "@microsoft/fast-element";

const designSystemTemplate = html`
    <a
        class="fast-design-system"
        href="${x => x.url}"
        target="_blank"
        rel="noopener noreferrer"
        :innerHTML=${x => x.icon}
    />
`;

export default designSystemTemplate;
