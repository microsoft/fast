import { html } from "@microsoft/fast-element";

const communityTemplate = html`<site-content-placement icon>
    <div slot="icon" :innerHTML=${x => x.icon}></div>
    <h3>${x => x.header}</h3>
    <p slot="body">${x => x.body}</p>
    <fast-anchor slot="action" appearance="lightweight" href=${x => x.actionLink}
        >${x => x.actionText}</fast-anchor
    >
</site-content-placement> `;

export default communityTemplate;
