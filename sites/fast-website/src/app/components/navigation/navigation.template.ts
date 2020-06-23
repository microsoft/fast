import { html, when } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "@microsoft/fast-foundation";
import CloseIcon from "svg/icon-close.svg";
import MenuIcon from "svg/icon-menu.svg";
import { Navigation } from "./navigation";

export const NavigationTemplate = html<Navigation>`
    <template
        class="site-navigation ${x => (x.opened ? "opened" : "")}
        ${x => (x.debounce ? "debounce" : "")}"
    >
        ${startTemplate}
        <fast-button
            class="nav-button"
            part="nav-button"
            appearance="stealth"
            @click="${(x, c) => x.handleOpenNavClick(c.event)}"
        >
            ${when(x => !x.opened, html` ${MenuIcon} `)}
            ${when(x => x.opened, html` ${CloseIcon} `)}
        </fast-button>
        <nav>
            <slot></slot>
        </nav>
        ${endTemplate}
    </template>
`;
