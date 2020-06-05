import { html } from "@microsoft/fast-element";

const featureTemplate = html`<site-feature-card>
    <div>${x => x.item}</div>
    <h4>${x => x.header}</h4>
    <p slot="body">${x => x.body}</p>
    <fast-anchor slot="footer" href=${x => x.githubLink} appearance="lightweight"
        >View Github</fast-anchor
    >
    <fast-anchor slot="footer" href=${x => x.documentationLink} appearance="lightweight"
        >Read Documentation</fast-anchor
    >
</site-feature-card> `;

export default featureTemplate;
