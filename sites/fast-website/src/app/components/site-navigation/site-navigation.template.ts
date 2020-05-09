import { html, repeat } from "@microsoft/fast-element";
import { SiteNavigation } from "./site-navigation";

export const SiteNavigationTemplate = html<SiteNavigation>`
    <template>
        <nav>
            <ul>
                ${repeat(
                    x => x.items,
                    html` <li><fast-anchor>Component</fast-anchor></li> `
                )}
            </ul>
            <slot></slot>
        </nav>
    </template>
`;
