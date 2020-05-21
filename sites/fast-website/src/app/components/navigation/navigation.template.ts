import { html, when } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "@microsoft/fast-foundation";
import { Navigation } from "./navigation";
import MenuIcon from "svg/icon-menu.svg";
import CloseIcon from "svg/icon-close.svg";

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
            ${when(x => !x.opened, html` ${MenuIcon} `)}
            ${when(x => x.opened, html` ${CloseIcon} `)}
        </fast-button>
    </template>
`;
