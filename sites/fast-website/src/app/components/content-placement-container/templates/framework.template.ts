import { html } from "@microsoft/fast-element";

const frameworkTemplate = html`<site-content-placement class="framework_ContentPlacement">
    <h3>
        ${x => (x.headerSubscript ? x.header + " " : x.header)}
        <small class="headerSubscript">${x => x.headerSubscript}</small>
    </h3>
    <p slot="body">${x => x.body}</p>
</site-content-placement>`;

export default frameworkTemplate;
