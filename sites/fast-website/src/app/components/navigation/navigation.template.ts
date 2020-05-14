import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "@microsoft/fast-components";
import { Navigation } from "./navigation";

export const NavigationTemplate = html<Navigation>`
    <template>
        ${startTemplate}
        <nav>
            <slot></slot>
        </nav>
        ${endTemplate}
    </template>
`;
