import { html, repeat } from "@microsoft/fast-element";
import { linkTemplate } from "./link.template";

const featureTemplate = html`
    <site-feature-card>
        <h4>${x => x.header}</h4>
        <p slot="body">${x => x.body}</p>
        ${repeat(x => x.links, linkTemplate("footer"))}
    </site-feature-card>
`;

export default featureTemplate;
