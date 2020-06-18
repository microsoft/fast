import { html, repeat } from "@microsoft/fast-element";

const linkTemplate = html`<fast-anchor
    slot="footer"
    href=${x => x.url}
    appearance="lightweight"
>
    ${x => x.anchorText}
</fast-anchor>`;

const featureTemplate = html`<site-feature-card>
    <h4>${x => x.header}</h4>
    <p slot="body">${x => x.body}</p>
    ${repeat(x => x.links, linkTemplate)}
</site-feature-card> `;

export default featureTemplate;
