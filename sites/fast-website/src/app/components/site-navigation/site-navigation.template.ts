import { html, slotted } from "@microsoft/fast-element";
import { SiteNavigation } from "./site-navigation";

export const SiteNavigationTemplate = html<SiteNavigation>`
    <template>
        <nav>
            <slot ${slotted("items")}></slot>
        </nav>
    </template>
`;
