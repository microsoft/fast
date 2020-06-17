import { html } from "@microsoft/fast-element";

const featureTemplate = html`<site-feature-card>
    <h4>${x => x.header}</h4>
    <p slot="body">${x => x.body}</p>
    <fast-anchor
        slot="footer"
        href=${x => x.githubLink}
        appearance="lightweight"
        aria-label=${x => x.header}
        >View Github</fast-anchor
    >
    <fast-anchor
        slot="footer"
        href=${x => x.documentationLink}
        appearance="lightweight"
        aria-label=${x => x.header}
        >Read Documentation</fast-anchor
    >
</site-feature-card> `;

export default featureTemplate;
