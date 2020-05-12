import { html, slotted } from "@microsoft/fast-element";
import { Navigation } from "./navigation";

export const NavigationTemplate = html<Navigation>`
    <template>
        <nav>
            <slot ${slotted("items")}></slot>
        </nav>
    </template>
`;
