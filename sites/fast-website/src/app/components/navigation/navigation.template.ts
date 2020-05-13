import { html } from "@microsoft/fast-element";
import { Navigation } from "./navigation";
import { startTemplate, endTemplate } from "@microsoft/fast-components";

export const NavigationTemplate = html<Navigation>`
    <template>
        ${startTemplate}
        <nav>
            <slot></slot>
        </nav>
        ${endTemplate}
    </template>
`;
