import { html, when } from "@microsoft/fast-element";
export const NavigationItemTemplate = html`
    <li>
        ${when(
            x => x.href,
            html`
                <fast-anchor
                    part="item-link"
                    appearance="lightweight"
                    href="${x => x.href}"
                >
                    <slot></slot>
                </fast-anchor>
            `
        )}
        ${when(
            x => !x.href,
            html`
                <slot></slot>
            `
        )}
    </li>
`;
