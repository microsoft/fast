import { html } from "@microsoft/fast-element";

const designSystemTemplate = html`
    <a href="${x => x.url}" class="fast-design-system-link" rel="noopener noreferrer">
        <span class="fast-design-system" :innerHTML=${x => x.icon}></span>
        <p>${x => x.anchorText}</p>
    </a>
`;

export default designSystemTemplate;
