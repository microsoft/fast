import { html } from "@microsoft/fast-element";

const designSystemTemplate = html`
    <a
        href="${x => x.url}"
        class="fast-design-system-link"
        target="_blank"
        rel="noopener noreferrer"
    >
        <span class="fast-product" :innerHTML=${x => x.icon}></span>
        <p>${x => x.label}</p>
    </a>
`;

export default designSystemTemplate;
