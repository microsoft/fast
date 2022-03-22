import { html } from "@microsoft/fast-element";

const productTemplate = html`
    <a href="${x => x.url}" class="fast-product-link" rel="noopener noreferrer">
        <span class="fast-product" :innerHTML=${x => x.icon}></span>
        <p>${x => x.anchorText}</p>
    </a>
`;

export default productTemplate;
