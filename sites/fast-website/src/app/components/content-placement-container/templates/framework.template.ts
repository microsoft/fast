import { html, repeat } from "@microsoft/fast-element";
import { linkTemplate } from "./link.template";

const frameworkTemplate = html`
    <site-content-placement>
        <h3>
            ${x => (x.headerSubscript ? x.header + " " : x.header)}
            <small class="headerSubscript">${x => x.headerSubscript}</small>
        </h3>
        <p slot="body">${x => x.body}</p>
        ${repeat(x => x.links, linkTemplate("action"))}
    </site-content-placement>
`;

export default frameworkTemplate;
