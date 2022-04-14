import { html } from "@microsoft/fast-element";

export const linkTemplate = (slot: string) => html`
    <fast-anchor slot="${slot}" href=${x => x.url} appearance="lightweight">
        ${x => x.anchorText}
    </fast-anchor>
`;
