import { html } from "@microsoft/fast-element";
import { linkTemplate } from "./link.template";

const communityTemplate = html`
    <site-content-placement icon>
        <div slot="icon" :innerHTML=${x => x.icon}></div>
        <h3>${x => x.header}</h3>
        <p slot="body">${x => x.body}</p>
        ${linkTemplate("action")}
    </site-content-placement>
`;

export default communityTemplate;
