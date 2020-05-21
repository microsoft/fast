import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "@microsoft/fast-foundation";
import { Navigation } from "./navigation";
import MenuIcon from "svg/icon-menu.svg";

export const NavigationTemplate = html<Navigation>`
    <template class="site-navigation ${x => (x.opened ? "opened" : "")}">
        ${startTemplate}
        <nav>
            <slot></slot>
        </nav>
        ${endTemplate}
        <fast-button
            class="nav-button"
            part="nav-button"
            appearance="stealth"
            @click="${(x, c) => x.handleOpenNavClick(c.event)}"
        >
            ${MenuIcon}
        </fast-button>
    </template>
`;
