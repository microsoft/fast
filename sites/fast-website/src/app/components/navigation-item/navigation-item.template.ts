import { html, when } from "@microsoft/fast-element";
import { NavigationItem } from "./navigation-item";

export const NavigationItemTemplate = html<NavigationItem>`
    <li>
        ${when(
            x => x.href,
            html<NavigationItem>`
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
            html<NavigationItem>`
                <slot></slot>
            `
        )}
    </li>
`;
