import { html } from "@microsoft/fast-element";

const productTemplate = html`
    <a
        class="fast-product"
        href="${x => x.url}"
        target="_blank"
        rel="noopener noreferrer"
        :innerHTML=${x => x.icon}
    />
`;

export default productTemplate;
